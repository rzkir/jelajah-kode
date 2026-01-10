"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { TypographyContent } from "@/components/ui/typography";

function cleanMarkdownCodeBlocks(content: string): string {
    // Remove markdown code blocks (```html ... ``` or ``` ... ```)
    let cleaned = content.replace(/```html\s*\n?/gi, "");
    cleaned = cleaned.replace(/```\s*\n?/g, "");
    cleaned = cleaned.replace(/```$/gm, "");

    // Remove any remaining markdown code block markers
    cleaned = cleaned.replace(/^```.*$/gm, "");

    // Trim whitespace
    cleaned = cleaned.trim();

    return cleaned;
}

interface DialogContentAIProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aiGeneratedTitle: string;
    aiGeneratedDescription: string;
    aiGeneratedContent: string;
    onApplyTitle: () => void;
    onApplyDescription: () => void;
    onApplyContent: () => void;
    onApplyAll: () => void;
}

export default function DialogContentAI({
    open,
    onOpenChange,
    aiGeneratedTitle,
    aiGeneratedDescription,
    aiGeneratedContent,
    onApplyTitle,
    onApplyDescription,
    onApplyContent,
    onApplyAll,
}: DialogContentAIProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col z-50">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        AI Generated Content
                    </DialogTitle>
                    <DialogDescription>
                        Review the AI-generated content and apply it to your form if you like it.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto pr-2 py-4 flex-1 min-h-0">
                    {aiGeneratedTitle && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Title</Label>
                            <div className="p-3 border rounded-md">
                                <TypographyContent
                                    html={aiGeneratedTitle}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onApplyTitle}
                                className="w-full"
                            >
                                Apply Title
                            </Button>
                        </div>
                    )}
                    {aiGeneratedDescription && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Description</Label>
                            <div className="p-3 border rounded-md">
                                <TypographyContent
                                    html={aiGeneratedDescription}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onApplyDescription}
                                className="w-full"
                            >
                                Apply Description
                            </Button>
                        </div>
                    )}
                    {aiGeneratedContent && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Content</Label>
                            <div className="p-3 border rounded-md max-h-96 overflow-y-auto">
                                <TypographyContent
                                    html={cleanMarkdownCodeBlocks(aiGeneratedContent)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onApplyContent}
                                className="w-full"
                            >
                                Apply Content
                            </Button>
                        </div>
                    )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="default"
                        onClick={onApplyAll}
                        className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={!aiGeneratedTitle && !aiGeneratedDescription && !aiGeneratedContent}
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Apply All
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

