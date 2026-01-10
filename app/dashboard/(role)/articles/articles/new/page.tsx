import { Suspense } from "react";

import NewArticleForm from "@/components/dashboard/articles/articles/create/NewArticlesForm";

export const metadata = {
  title: "Create Article | Jelal Kode",
  description: "Create a new article in your Jelal Kode platform",
};

export default function NewArticlePage() {
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
      <NewArticleForm />
    </Suspense>
  );
}
