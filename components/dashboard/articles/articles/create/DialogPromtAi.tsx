"use client";

import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DialogPromptAIProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aiPrompt: string;
    setAiPrompt: (prompt: string) => void;
    isAIGenerating: boolean;
    onGenerateAll: () => void;
    onGenerateTitle: () => void;
    onGenerateDescription: () => void;
    onGenerateContent: () => void;
}

export default function DialogPromptAI({
    open,
    onOpenChange,
    aiPrompt,
    setAiPrompt,
    isAIGenerating,
    onGenerateAll,
    onGenerateTitle,
    onGenerateDescription,
    onGenerateContent,
}: DialogPromptAIProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                onOpenChange(isOpen);
                if (!isOpen && !isAIGenerating) {
                    setAiPrompt("");
                }
            }}
        >
            <DialogContent className="sm:max-w-[600px] p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        AI Article Generator
                    </DialogTitle>
                    <DialogDescription>
                        Enter a topic or description for your article. AI will generate title, description, and content for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="ai-prompt">Article Topic / Description</Label>
                        <Textarea
                            id="ai-prompt"
                            placeholder="e.g., How to build a REST API with Node.js and Express"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            rows={4}
                            disabled={isAIGenerating}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Describe what your article should be about. Be as specific as possible for better results.
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="default"
                        onClick={onGenerateAll}
                        disabled={isAIGenerating || !aiPrompt.trim()}
                        className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {isAIGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate All
                            </>
                        )}
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onGenerateTitle}
                            disabled={isAIGenerating || !aiPrompt.trim()}
                            className="flex-1 sm:flex-none"
                        >
                            {isAIGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Title
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onGenerateDescription}
                            disabled={isAIGenerating || !aiPrompt.trim()}
                            className="flex-1 sm:flex-none"
                        >
                            {isAIGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Description
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onGenerateContent}
                            disabled={isAIGenerating || !aiPrompt.trim()}
                            className="flex-1 sm:flex-none"
                        >
                            {isAIGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Content
                                </>
                            )}
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

