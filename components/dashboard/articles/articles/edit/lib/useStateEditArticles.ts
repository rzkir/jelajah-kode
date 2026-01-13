import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/utils/context/AuthContext";

import { API_CONFIG } from "@/lib/config";

export function useStateEditArticles() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const articleId = searchParams.get("id");

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
  const [articleMongoId, setArticleMongoId] = useState<string>("");

  // Combined effect for validation and data fetching
  useEffect(() => {
    if (!articleId) {
      router.push("/dashboard/articles/articles");
      return;
    }

    const fetchCollectionsAndArticle = async () => {
      try {
        // Fetch collections first
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

        let categoriesData: ArticlesCategory[] = [];
        let tagsData: ArticlesTags[] = [];

        if (categoriesRes.ok) {
          categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (tagsRes.ok) {
          tagsData = await tagsRes.json();
          setTags(tagsData);
        }

        // Fetch article data using articlesId endpoint
        const response = await fetch(
          API_CONFIG.ENDPOINTS.articles.byArticlesId(articleId),
          {
            headers: {
              Authorization: `Bearer ${API_CONFIG.SECRET}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const article: Articles = await response.json();

        // Store MongoDB _id for PUT request
        if (article._id) {
          setArticleMongoId(article._id);
        }

        // Set form data with existing article data
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: article.title,
          articlesId: article.articlesId,
          thumbnail: article.thumbnail,
          description: article.description,
          content: article.content || "",
          category: article.category
            ? (() => {
                // Handle backward compatibility: check if category is array or object
                const categoryObj = Array.isArray(article.category)
                  ? article.category[0]
                  : article.category;
                const categoryId = categoryObj?.categoryId;
                const foundCategory = categoriesData.find(
                  (cat) => cat.categoryId === categoryId
                );
                return foundCategory ? foundCategory._id : "";
              })()
            : "",
          status: article.status,
          tags: article.tags
            ? article.tags
                .map((tag: { title: string; tagsId: string }) => {
                  // Find tag _id by tagsId
                  const foundTag = tagsData.find(
                    (t) => t.tagsId === tag.tagsId
                  );
                  return foundTag ? foundTag._id : null;
                })
                .filter((id: string | null): id is string => id !== null)
            : [],
        }));
      } catch (error) {
        console.error("Error fetching collections or article:", error);
        toast.error("Failed to load article data");
        router.push("/dashboard/articles/articles");
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };

    fetchCollectionsAndArticle();
  }, [articleId, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!articleId) {
      toast.error("Article ID is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Update existing article using _id from MongoDB
      if (!articleMongoId) {
        toast.error("Article ID is required");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.articles.base}?id=${articleMongoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_CONFIG.SECRET}`,
          },
          body: JSON.stringify({
            ...formData,
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update article");
      }

      await response.json();
      toast.success("Article updated successfully!");
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
    articleId,
    // Handlers
    handleThumbnailUpload,
    handleChange,
    handleSubmit,
  };
}
