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
  createdAt?: string;
  updatedAt?: string;
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

interface ArticlesCategoryPageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

interface ArticlesPageProps {
  searchParams?: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

interface UseStateArticlesProps {
  articles: Articles[];
  initialFilters?: {
    category?: string;
    page?: string;
    sort?: string;
  };
}

interface ArticlesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ArticlesProps {
  articles: Articles[];
  categories: Array<{ _id?: string; categoryId?: string; title: string }>;
  pagination?: ArticlesPagination;
  initialFilters?: {
    category?: string;
    page?: string;
    sort?: string;
  };
  page?: number;
}

//====================== Articles Details ======================//
interface ArticlesDetails {
  _id: string;
  articlesId: string;
  title: string;
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
  createdAt: string;
  updatedAt: string;
}
