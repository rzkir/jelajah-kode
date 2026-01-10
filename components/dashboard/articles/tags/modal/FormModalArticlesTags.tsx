"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Loader2, Plus } from "lucide-react";

export default function FormModalArticlesTags({
  isDialogOpen,
  setIsDialogOpen,
  editingTags,
  formData,
  setFormData,
  isSubmitting,
  handleSubmit,
  resetForm,
  useTriggerButton = false,
}: FormModalArticlesTagsProps) {
  const content = (
    <DialogContent className="sm:max-w-[500px] p-0">
      <div className="px-6 py-6 border-b">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingTags ? "Edit Tag" : "Create Tag"}
          </DialogTitle>
          <DialogDescription>
            {editingTags
              ? "Edit your tag details below."
              : "Fill in the information below to create a new tag."}
          </DialogDescription>
        </DialogHeader>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Tag Name
          </Label>
          <Input
            id="name"
            value={formData.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              // Generate tagsId from title by converting to lowercase and replacing spaces with hyphens
              const newTagsId = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
                .replace(/\s+/g, "-") // Replace spaces with hyphens
                .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
                .trim();

              setFormData({
                ...formData,
                title: newTitle,
                tagsId: newTagsId,
              });
            }}
            placeholder="Enter tag name"
            className="w-full"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagsId" className="text-sm font-medium">
            Tag ID
          </Label>
          <Input
            id="tagsId"
            value={formData.tagsId}
            onChange={(e) =>
              setFormData({
                ...formData,
                tagsId: e.target.value,
              })
            }
            placeholder="Auto-generated from title"
            className="w-full"
            disabled={isSubmitting}
            readOnly={!editingTags} // Allow editing only when editing existing tag
          />
          {!editingTags && (
            <p className="text-xs text-muted-foreground">
              Auto-generated from title. You can edit this when editing an
              existing tag.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}
            disabled={isSubmitting}
            className="px-4"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-4">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingTags ? "Updating..." : "Creating..."}
              </>
            ) : editingTags ? (
              "Update Tag"
            ) : (
              "Create Tag"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}
    >
      {useTriggerButton && (
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tag
          </Button>
        </DialogTrigger>
      )}
      {content}
    </Dialog>
  );
}
