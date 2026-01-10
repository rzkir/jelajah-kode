"use client";

import * as React from "react";

import { Check, ChevronsUpDown, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

import Image from "next/image";

import QuillEditor from "@/helper/editor/QuillEditor";

import { useStateCreateArticles } from "@/components/dashboard/articles/articles/create/lib/useStateCreateArticles";

import FormSkelaton from "@/components/dashboard/products/products/FormSkelaton";

import DialogPromptAI from "@/components/dashboard/articles/articles/create/DialogPromtAi";

import DialogContentAI from "@/components/dashboard/articles/articles/create/DialogContentAi";

function cleanMarkdownCodeBlocks(content: string): string {

  let cleaned = content.replace(/```html\s*\n?/gi, "");
  cleaned = cleaned.replace(/```\s*\n?/g, "");
  cleaned = cleaned.replace(/```$/gm, "");

  return cleaned.trim();
}

export default function NewArticleForm() {
  const router = useRouter();
  const {
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
    handleThumbnailUpload,
    handleChange,
    handleSubmit,
    handleAIGenerate,
    handleAIGenerateAll,
    handleApplyAIContent,
    handleApplyAll,
  } = useStateCreateArticles();

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  if (isPageLoading) {
    return <FormSkelaton />;
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Create Article</CardTitle>
        </CardHeader>
        <CardContent>
          {/* AI Assistant CTA */}
          <div className="mb-6 p-4 border rounded-lg bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Assistant</h3>
                  <p className="text-sm">
                    Generate article content using AI in seconds
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="default"
                onClick={() => setAiPromptDialogOpen(true)}
                className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Article title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="articlesId">Article ID *</Label>
                  <Input
                    id="articlesId"
                    name="articlesId"
                    value={formData.articlesId}
                    required
                    placeholder="Unique article identifier"
                    readOnly
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value: "publish" | "draft") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between"
                      >
                        {formData.category
                          ? categories.find(
                            (category) => category._id === formData.category
                          )?.title
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search category..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category._id}
                                value={category.title}
                                onSelect={(currentValue) => {
                                  const selectedCategory = categories.find(
                                    (cat) => cat.title === currentValue
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    category:
                                      selectedCategory?._id === formData.category
                                        ? ""
                                        : selectedCategory?._id || "",
                                  }));
                                  setCategoryOpen(false);
                                }}
                              >
                                {category.title}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    formData.category === category._id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tags">Tags</Label>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag._id}
                        className={`border rounded-md p-3 cursor-pointer transition-colors ${formData.tags.includes(tag._id)
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(tag._id)
                              ? prev.tags.filter((id) => id !== tag._id)
                              : [...prev.tags, tag._id],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border ${formData.tags.includes(tag._id)
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                              }`}
                          >
                            {formData.tags.includes(tag._id) && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {tag.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="thumbnail">Thumbnail *</Label>
                <div className="space-y-2">
                  {formData.thumbnail && (
                    <div className="relative w-full h-32 max-w-xs">
                      <Image
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, thumbnail: "" }))
                        }
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <span className="w-4 h-4 flex items-center justify-center">
                          ×
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="relative w-full">
                    <Input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("thumbnail-upload")?.click()
                      }
                      disabled={isThumbnailUploading}
                      className="w-full"
                    >
                      {isThumbnailUploading && formData.thumbnail
                        ? "Uploading new..."
                        : !formData.thumbnail
                          ? "Choose Thumbnail"
                          : "Change Thumbnail"}
                    </Button>
                    {thumbnailUploadProgress > 0 && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${thumbnailUploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Article description"
                  rows={6}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <QuillEditor
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content: content }))
                  }
                  placeholder="Article content"
                />
              </div>
            </div>

            {/* Author Information */}
            <div className="border rounded-lg p-4 bg-muted">
              <h3 className="font-medium mb-2">Author Information</h3>
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <span className="text-foreground text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{user?.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This article will be associated with your account.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* AI Prompt Dialog */}
      <DialogPromptAI
        open={aiPromptDialogOpen}
        onOpenChange={setAiPromptDialogOpen}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        isAIGenerating={isAIGenerating}
        onGenerateAll={handleAIGenerateAll}
        onGenerateTitle={() => handleAIGenerate("title")}
        onGenerateDescription={() => handleAIGenerate("description")}
        onGenerateContent={() => handleAIGenerate("content")}
      />

      {/* AI Generated Content Dialog */}
      <DialogContentAI
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        aiGeneratedTitle={cleanMarkdownCodeBlocks(aiGeneratedTitle)}
        aiGeneratedDescription={cleanMarkdownCodeBlocks(aiGeneratedDescription)}
        aiGeneratedContent={cleanMarkdownCodeBlocks(aiGeneratedContent)}
        onApplyTitle={() => handleApplyAIContent("title")}
        onApplyDescription={() => handleApplyAIContent("description")}
        onApplyContent={() => handleApplyAIContent("content")}
        onApplyAll={handleApplyAll}
      />
    </section>
  );
}
