//====================== Products ======================//
interface Products {
  _id: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  description: string;
  faqs: string;
  price: number;
  stock: number;
  sold?: number;
  category: ProductsCategory[];
  rating?: number;
  views?: number;
  ratingCount?: number; // Changed from rating to ratingCount
  reviews?: Productsreview[];
  images?: string[];
  tags?: string[];
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

interface Productsframeworks {
  title: string;
  frameworkId: string;
}

interface ProductsCategory {
  title: string;
  categoryId: string;
}

interface Productsreview {
  _id: string;
  name: string;
  date: string;
  picture: string;
  rating: number;
  comment: string;
}

//====================== Category ======================//
interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
  title: string;
  categoryId: string;
}

type ProjectsCategoryProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsCategoryProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  formData: { title: string; categoryId: string };
  setFormData: (v: { title: string; categoryId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

//====================== Framework ======================//
