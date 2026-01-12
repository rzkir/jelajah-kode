import { useState, useRef } from "react";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";
import { getApiUrl } from "@/lib/development";
import { useAuth } from "@/utils/context/AuthContext";

export function useStateAccounts() {
  const { refreshUserData, user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleEditPicture = () => {
    fileInputRef.current?.click();
  };

  const getTitle = () => {
    if (user?.role === "admins") return "Administrator";
    return "User";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to ImageKit
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(API_CONFIG.ENDPOINTS.uploadPicture, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const uploadResult = await uploadResponse.json();

      // Update user profile with new picture URL
      // Use getApiUrl to handle development/production routing
      const meUrl = getApiUrl("/api/auth/proxy-me", API_CONFIG.ENDPOINTS.me);

      const updateResponse = await fetch(meUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          picture: uploadResult.url,
        }),
      });

      if (!updateResponse.ok) {
        // Handle rate limit errors
        if (updateResponse.status === 429) {
          const { handleRateLimitError } = await import(
            "@/lib/rate-limit-handler"
          );
          const handled = await handleRateLimitError(
            updateResponse,
            "Terlalu banyak permintaan. Silakan coba lagi nanti."
          );
          if (handled) {
            return;
          }
        }
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refresh user data
      await refreshUserData();

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading picture:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload picture. Please try again."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return {
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    fileInputRef,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    handleEditPicture,
    handleFileChange,
    getTitle,
  };
}
