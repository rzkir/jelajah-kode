interface Articles {
  _id: string;
  title: string;
  articlesId: string;
  thumbnail: string;
  description: string;
  content: string;
  category: ArticlesCategory;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  tags?: ArticlesTags[];
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

interface ArticlesTags {
  _id: string;
  title: string;
  tagsId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ArticlesCategory {
  _id: string;
  title: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryFormDataState {
  title: string;
  categoryId: string;
}

type ArticlesCategoryProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalArticlesCategoryProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingCategory: ArticlesCategory | null;
  formData: CategoryFormDataState;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataState>>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

type ArticlesTagsProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalArticlesTagsProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingTags: ArticlesTags | null;
  formData: { title: string; tagsId: string };
  setFormData: (v: { title: string; tagsId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};
