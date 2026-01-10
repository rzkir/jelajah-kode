import { Suspense } from "react";

import EditArticleForm from "@/components/dashboard/articles/articles/edit/EditArticlesForm";

export const metadata = {
  title: "Edit Article | Jelal Kode",
  description: "Edit and update article details in your Jelal Kode platform",
};

export default function EditArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="container flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <EditArticleForm />
    </Suspense>
  );
}
