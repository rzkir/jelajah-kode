"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

export default function useStateArticlesTags() {
  const [tags, setTags] = useState<Tags[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tags | null>(null);
  const [editingTag, setEditingTag] = useState<Tags | null>(null);
  const [formData, setFormData] = useState<{ title: string; tagsId: string }>({
    title: "",
    tagsId: "",
  });

  const fetchTags = async () => {
    try {
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.articles.tags;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTags(data);
      } else {
        console.error("Expected array of tags but got:", data);
        setTags([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
      toast.error("Failed to fetch tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", tagsId: "" });
    setEditingTag(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = API_CONFIG.ENDPOINTS.articles.tags;
      const method = editingTag ? "PUT" : "POST";
      const body = editingTag
        ? {
            id: editingTag._id,
            title: formData.title,
            tagsId: formData.tagsId,
          }
        : { title: formData.title, tagsId: formData.tagsId };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save tag");

      toast.success(`Tag ${editingTag ? "updated" : "created"} successfully`);
      setIsDialogOpen(false);
      fetchTags();
      resetForm();
    } catch (error) {
      console.error(
        `Error ${editingTag ? "updating" : "creating"} tag:`,
        error
      );
      toast.error(`Failed to ${editingTag ? "update" : "create"} tag`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;

    setIsDeleting(true);
    try {
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.articles.tags;

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, { method: "DELETE", headers });

      if (!response.ok) throw new Error("Failed to delete tag");

      toast.success("Tag deleted successfully");
      fetchTags();
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (tag: Tags) => {
    setEditingTag(tag);
    setFormData({
      title: tag.title,
      tagsId: tag.tagsId,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (tag: Tags) => {
    setTagToDelete(tag);
    setIsDeleteDialogOpen(true);
  };

  return {
    // data
    tags,
    formData,
    editingTag,
    tagToDelete,
    // loading state
    isLoading,
    isSubmitting,
    isDeleting,
    // modal state
    isDialogOpen,
    isDeleteDialogOpen,
    // pagination placeholders (none for tags yet)
    // setters
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    setTagToDelete,
    setEditingTag,
    // handlers
    fetchTags,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  };
}
