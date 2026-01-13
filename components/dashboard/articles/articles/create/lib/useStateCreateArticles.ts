import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/utils/context/AuthContext";

import { generateProjectId } from "@/hooks/TextFormatter";

import { API_CONFIG } from "@/lib/config";

import { streamChat } from "@/lib/api-client";

import { processImageUrls } from "@/lib/utils";

export function useStateCreateArticles() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<ArticlesCategory[]>([]);
  const [tags, setTags] = useState<ArticlesTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    articlesId: "",
    thumbnail: "",
    description: "",
    content: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "publish" | "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  // AI State
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState("");
  const [aiGeneratedTitle, setAiGeneratedTitle] = useState("");
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPromptDialogOpen, setAiPromptDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Auto-generate articlesId from title
  useEffect(() => {
    if (formData.title) {
      const generatedId = generateProjectId(formData.title);
      setFormData((prev) => ({
        ...prev,
        articlesId: generatedId,
      }));
    }
  }, [formData.title]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(API_CONFIG.ENDPOINTS.articles.categories, {
            headers: {
              Authorization: `Bearer ${API_CONFIG.SECRET}`,
            },
          }),
          fetch(API_CONFIG.ENDPOINTS.articles.tags, {
            headers: {
              Authorization: `Bearer ${API_CONFIG.SECRET}`,
            },
          }),
        ]);

        if (categoriesRes.ok) {
          const categoriesData: ArticlesCategory[] = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (tagsRes.ok) {
          const tagsData: ArticlesTags[] = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load categories and tags");
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsThumbnailUploading(true);
    setThumbnailUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      // Simulate upload progress
      const interval = setInterval(() => {
        setThumbnailUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const apiSecret = API_CONFIG.SECRET;
      const headers: HeadersInit = {};
      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(API_CONFIG.ENDPOINTS.products.upload, {
        method: "POST",
        headers,
        body: uploadFormData,
      });

      clearInterval(interval);
      setThumbnailUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload thumbnail");
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        thumbnail: result.url,
      }));

      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload thumbnail"
      );
    } finally {
      setIsThumbnailUploading(false);
      setThumbnailUploadProgress(0);
      // Reset the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAIGenerate = async (
    type: "title" | "description" | "content"
  ) => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsAIGenerating(true);
    setAiGeneratedContent("");
    setAiGeneratedTitle("");
    setAiGeneratedDescription("");

    try {
      let systemPrompt = "";
      let userPrompt = "";

      switch (type) {
        case "title":
          systemPrompt =
            "You are a helpful assistant that generates article titles. Generate a catchy, SEO-friendly title based on the user's prompt. Return only the title, no additional text.";
          userPrompt = `Generate an article title for: ${aiPrompt}`;
          break;
        case "description":
          systemPrompt =
            "You are a helpful assistant that generates article descriptions. Generate a compelling, SEO-friendly description (2-3 sentences) based on the user's prompt. Return only the description, no additional text.";
          userPrompt = `Generate an article description for: ${aiPrompt}`;
          break;
        case "content":
          systemPrompt =
            'You are a helpful assistant that generates article content. Generate well-structured, informative article content in HTML format based on the user\'s prompt. Use proper HTML tags like <p>, <h2>, <h3>, <ul>, <ol>, <li>, etc. For images, always use HTML <img> tags with proper src attribute, like <img src="image-url" alt="description" />. Make it comprehensive and engaging.';
          userPrompt = `Generate article content for: ${aiPrompt}`;
          break;
      }

      await streamChat({
        endpoint: API_CONFIG.ENDPOINTS.chat.academia,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
        onChunk: (content) => {
          if (type === "title") {
            setAiGeneratedTitle(content);
          } else if (type === "description") {
            setAiGeneratedDescription(content);
          } else {
            setAiGeneratedContent(content);
          }
        },
        onError: (error) => {
          toast.error(`AI generation failed: ${error}`);
          setIsAIGenerating(false);
        },
      });

      setAiPromptDialogOpen(false);
      setAiDialogOpen(true);
      toast.success("AI content generated successfully!");
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate AI content");
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleAIGenerateAll = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsAIGenerating(true);
    setAiGeneratedContent("");
    setAiGeneratedTitle("");
    setAiGeneratedDescription("");

    try {
      // Generate Title
      await streamChat({
        endpoint: API_CONFIG.ENDPOINTS.chat.academia,
        messages: [
          {
            role: "user",
            content: `You are a helpful assistant that generates article titles. Generate a catchy, SEO-friendly title based on the user's prompt. Return only the title, no additional text.\n\nGenerate an article title for: ${aiPrompt}`,
          },
        ],
        onChunk: (content) => {
          setAiGeneratedTitle(content);
        },
        onError: (error) => {
          toast.error(`AI title generation failed: ${error}`);
        },
      });

      // Generate Description
      await streamChat({
        endpoint: API_CONFIG.ENDPOINTS.chat.academia,
        messages: [
          {
            role: "user",
            content: `You are a helpful assistant that generates article descriptions. Generate a compelling, SEO-friendly description (2-3 sentences) based on the user's prompt. Return only the description, no additional text.\n\nGenerate an article description for: ${aiPrompt}`,
          },
        ],
        onChunk: (content) => {
          setAiGeneratedDescription(content);
        },
        onError: (error) => {
          toast.error(`AI description generation failed: ${error}`);
        },
      });

      // Generate Content
      await streamChat({
        endpoint: API_CONFIG.ENDPOINTS.chat.academia,
        messages: [
          {
            role: "user",
            content: `You are a helpful assistant that generates article content. Generate well-structured, informative article content in HTML format based on the user's prompt. Use proper HTML tags like <p>, <h2>, <h3>, <ul>, <ol>, <li>, etc. For images, always use HTML <img> tags with proper src attribute, like <img src="image-url" alt="description" />. Make it comprehensive and engaging.\n\nGenerate article content for: ${aiPrompt}`,
          },
        ],
        onChunk: (content) => {
          setAiGeneratedContent(content);
        },
        onError: (error) => {
          toast.error(`AI content generation failed: ${error}`);
        },
      });

      setAiPromptDialogOpen(false);
      setAiDialogOpen(true);
      toast.success("All AI content generated successfully!");
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate AI content");
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Function to clean markdown code blocks from content
  const cleanMarkdownCodeBlocks = (content: string): string => {
    // Remove markdown code blocks (```html ... ``` or ``` ... ```)
    let cleaned = content.replace(/```html\s*\n?/gi, "");
    cleaned = cleaned.replace(/```\s*\n?/g, "");
    cleaned = cleaned.replace(/```$/gm, "");

    // Remove any remaining markdown code block markers
    cleaned = cleaned.replace(/^```.*$/gm, "");

    // Process image URLs - convert markdown syntax and plain URLs to HTML img tags
    cleaned = processImageUrls(cleaned);

    // Trim whitespace
    cleaned = cleaned.trim();

    return cleaned;
  };

  const handleApplyAIContent = (type: "title" | "description" | "content") => {
    if (type === "title" && aiGeneratedTitle) {
      setFormData((prev) => ({ ...prev, title: aiGeneratedTitle.trim() }));
      toast.success("Title applied to form");
    } else if (type === "description" && aiGeneratedDescription) {
      setFormData((prev) => ({
        ...prev,
        description: aiGeneratedDescription.trim(),
      }));
      toast.success("Description applied to form");
    } else if (type === "content" && aiGeneratedContent) {
      const cleanedContent = cleanMarkdownCodeBlocks(aiGeneratedContent);
      setFormData((prev) => ({ ...prev, content: cleanedContent }));
      toast.success("Content applied to form");
    }
    setAiDialogOpen(false);
  };

  const handleApplyAll = () => {
    let appliedCount = 0;

    if (aiGeneratedTitle) {
      setFormData((prev) => ({ ...prev, title: aiGeneratedTitle.trim() }));
      appliedCount++;
    }

    if (aiGeneratedDescription) {
      setFormData((prev) => ({
        ...prev,
        description: aiGeneratedDescription.trim(),
      }));
      appliedCount++;
    }

    if (aiGeneratedContent) {
      const cleanedContent = cleanMarkdownCodeBlocks(aiGeneratedContent);
      setFormData((prev) => ({ ...prev, content: cleanedContent }));
      appliedCount++;
    }

    if (appliedCount > 0) {
      toast.success(`Applied ${appliedCount} content(s) to form`);
      setAiDialogOpen(false);
    } else {
      toast.error("No content to apply");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new article
      const response = await fetch(API_CONFIG.ENDPOINTS.articles.base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
        body: JSON.stringify({
          title: formData.title,
          articlesId: formData.articlesId,
          thumbnail: formData.thumbnail,
          description: formData.description,
          content: formData.content || "",
          status: formData.status,
          tags: formData.tags
            .map((tagId) => {
              const tag = tags.find((t) => t._id === tagId);
              return tag
                ? {
                    title: tag.title,
                    tagsId: tag.tagsId,
                  }
                : null;
            })
            .filter((tag) => tag !== null),
          category: formData.category
            ? {
                title:
                  categories.find((cat) => cat._id === formData.category)
                    ?.title || "",
                categoryId:
                  categories.find((cat) => cat._id === formData.category)
                    ?.categoryId || "",
              }
            : undefined,
          author: user
            ? {
                _id: user._id,
                name: user.name,
                picture: user.picture,
                role: user.role,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Show more detailed error message if available
        const errorMessage = errorData.details
          ? `${errorData.error}: ${
              Array.isArray(errorData.details)
                ? errorData.details.join(", ")
                : errorData.details
            }`
          : errorData.error || "Failed to create article";
        throw new Error(errorMessage);
      }

      toast.success("Article created successfully!");
      router.push(`/dashboard/articles/articles`);
    } catch (error) {
      console.error("Error processing article:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    categories,
    tags,
    loading,
    isPageLoading,
    formData,
    setFormData,
    isSubmitting,
    isThumbnailUploading,
    thumbnailUploadProgress,
    user,
    // AI State
    isAIGenerating,
    aiGeneratedContent,
    aiGeneratedTitle,
    aiGeneratedDescription,
    aiDialogOpen,
    setAiDialogOpen,
    aiPromptDialogOpen,
    setAiPromptDialogOpen,
    aiPrompt,
    setAiPrompt,
    // Handlers
    handleThumbnailUpload,
    handleChange,
    handleSubmit,
    handleAIGenerate,
    handleAIGenerateAll,
    handleApplyAIContent,
    handleApplyAll,
  };
}
