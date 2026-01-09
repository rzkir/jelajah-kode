//====================== Products ======================//
interface Products {
  _id: string;
  title: string;
  productsId: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  description: string;
  faqs: string;
  price: number;
  stock: number;
  sold?: number;
  downloadUrl?: string;
  downloadCount?: number;
  ratingCount?: number;
  ratingAverage?: number;
  category: ProductsCategory;
  type: ProductsType;
  images?: string[];
  licenses?: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  tags?: ProductsTags[];
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

interface Ratings {
  _id: string;
  productsId: string;
  rating: number;
  comment: string;
  author: RatingsUser;
  created_at: string;
  updated_at: string;
}

interface RatingsUser {
  _id: string;
  name: string;
  picture?: string;
  role: UserRole;
}

interface Productsframeworks {
  title: string;
  frameworkId: string;
  thumbnail: string;
}

interface ProductsCategory {
  title: string;
  categoryId: string;
}

interface ProductsType {
  title: string;
  typeId: string;
}

interface ProductsTags {
  title: string;
  tagsId: string;
}

interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Framework {
  _id: string;
  title: string;
  frameworkId: string;
  thumbnail: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Tag {
  _id: string;
  title: string;
  tagsId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Type {
  _id: string;
  title: string;
  typeId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateFormData {
  title: string;
  productsId: string;
  thumbnail: string;
  description: string;
  faqs: string;
  price: number;
  stock: number;
  downloadUrl?: string;
  category: string;
  frameworks: string[];
  tags: string[];
  type: string;
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  images: string[];
  licenses?: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
}

interface EditFormData {
  title: string;
  productsId: string;
  thumbnail: string;
  description: string;
  faqs: string;
  price: number;
  stock: number;
  downloadUrl?: string;
  category: string;
  frameworks: string[];
  tags: string[];
  type: string;
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  images: string[];
  licenses?: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
}

interface ProductsProps {
  products: ProductsSearchItem[];
  pagination: ProductsSearchPagination;
  categories: Array<{ _id?: string; categoryId?: string; title: string }>;
  types: Array<{ _id?: string; typeId?: string; title: string }>;
  initialFilters?: {
    q?: string;
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    new?: string;
    sort?: string;
    page?: string;
  };
  page?: number;
  disabledCategories?: boolean;
  disabledTypes?: boolean;
}

//====================== Category ======================//
interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormDataState {
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
  formData: CategoryFormDataState;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataState>>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

//====================== Framework ======================//
interface Framework {
  _id: string;
  title: string;
  frameworkId: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface FrameworkFormDataState {
  title: string;
  frameworkId: string;
}

type ProjectsFrameworkProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsFrameworkProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingFramework: Framework | null;
  formData: { title: string; frameworkId: string };
  setFormData: (v: { title: string; frameworkId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

// Define types for file upload functionality
interface PendingUpload {
  file: File;
  imageUrl: string;
  title: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

// Type for the form modal props
interface FormModalProjectsFrameworksProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  pendingUploads: PendingUpload[];
  setPendingUploads: React.Dispatch<React.SetStateAction<PendingUpload[]>>;
  uploadProgress: UploadProgress[];
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress[]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  isSubmitting: boolean;
  handleMultipleFileUpload: (files: File[]) => Promise<void>;
}

interface DeleteModalProjectsFrameworksProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

//====================== Tags ======================//
interface Tags {
  _id: string;
  title: string;
  tagsId: string;
  createdAt: string;
  updatedAt: string;
}

interface TagsFormDataState {
  title: string;
  tagsId: string;
}

type ProjectsTagsProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsTagsProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingTags: Tags | null;
  formData: { title: string; tagsId: string };
  setFormData: (v: { title: string; tagsId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

//====================== Type ======================//
interface Type {
  _id: string;
  title: string;
  typeId: string;
  createdAt: string;
  updatedAt: string;
}

interface TypeFormDataState {
  title: string;
  typeId: string;
}

type ProductsTypeProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProductsTypeProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingType: Type | null;
  formData: TypeFormDataState;
  setFormData: React.Dispatch<React.SetStateAction<TypeFormDataState>>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

//====================== Products Details ======================//
interface ProductsDetails {
  _id: string;
  title: string;
  productsId: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  description: string;
  faqs: string;
  price: number;
  stock: number;
  sold?: number;
  downloadUrl?: string;
  downloadCount?: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  ratingCount?: number;
  ratingAverage?: number;
  category: ProductsCategory;
  images: string[];
  licenses?: string[];
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  tags: ProductsTags[];
  type: ProductsType;
  paymentType: string;
  status: string;
  created_at: string;
  updated_at: string;
}

//====================== Products Search ======================//
interface ProductsSearchItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  price: number;
  stock: number;
  downloadUrl?: string;
  downloadCount?: number;
  ratingCount?: number;
  ratingAverage?: number;
  category: ProductsCategory;
  type: ProductsType;
  discount?: {
    type: string;
    value: number;
    until: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  tags?: ProductsTags[];
  paymentType: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface ProductsSearchPagination {
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface ProductsSearchResponse {
  data: ProductsSearchItem[];
  pagination: ProductsSearchPagination;
  query: string;
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    discounted?: string;
    new?: string;
    sort?: string;
  }>;
}

interface SearchProductsProps {
  products: ProductsSearchItem[];
  pagination: ProductsSearchPagination;
  query: string;
  page: number;
  categories: Array<{ _id?: string; categoryId?: string; title: string }>;
  types: Array<{ _id?: string; typeId?: string; title: string }>;
  initialFilters?: {
    q?: string;
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    new?: string;
    sort?: string;
  };
}

interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedTypes: string[];
  selectedTechStack: string[];
  priceRange: [number, number];
  minRating: number | null;
  popularOnly: boolean;
  newArrivals: boolean;
  sortBy: string;
}

interface SearchProductsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTechStack: string[];
  setSelectedTechStack: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  popularOnly: boolean;
  setPopularOnly: (value: boolean) => void;
  newArrivals: boolean;
  setNewArrivals: (value: boolean) => void;
  products: ProductsSearchItem[];
  categories: Array<{ _id?: string; categoryId?: string; title: string }>;
  types: Array<{ _id?: string; typeId?: string; title: string }>;
  // Collapsible states
  isCategoriesOpen: boolean;
  setIsCategoriesOpen: (open: boolean) => void;
  isTypeOpen: boolean;
  setIsTypeOpen: (open: boolean) => void;
  isRatingsOpen: boolean;
  setIsRatingsOpen: (open: boolean) => void;
  isTechStackOpen: boolean;
  setIsTechStackOpen: (open: boolean) => void;
}

type FilterAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_TYPES"; payload: string[] }
  | { type: "SET_TECH_STACK"; payload: string[] }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "SET_MIN_RATING"; payload: number | null }
  | { type: "SET_POPULAR_ONLY"; payload: boolean }
  | { type: "SET_NEW_ARRIVALS"; payload: boolean }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "RESET_FILTERS" };

//====================== Products Discount ======================//
interface ProductsDiscountItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  ratingAverage?: number;
  ratingCount?: number;
  category: ProductsCategory;
  frameworks: Productsframeworks[];
  discount: {
    type: "percentage" | "fixed";
    value: number;
    until: string;
  };
  author: {
    _id: string;
    name: string;
    picture: string;
    role: UserRole;
  };
  type: ProductsType;
  paymentType: "free" | "paid";
  created_at: string;
  updated_at: string;
}

interface ProductsDiscountPagination {
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface ProductsDiscountResponse {
  data: ProductsDiscountItem[];
  pagination: ProductsDiscountPagination;
}

//====================== Products Most Saled ======================//
interface ProductsMostSaledItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  ratingAverage?: number;
  ratingCount?: number;
  category: ProductsCategory;
  frameworks: Productsframeworks[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  type: ProductsType;
  paymentType: "free" | "paid";
  created_at: string;
  updated_at: string;
}

interface ProductsMostSaledPagination {
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface ProductsMostSaledResponse {
  data: ProductsMostSaledItem[];
  pagination: ProductsMostSaledPagination;
}

//====================== Products Popular (by downloads) ======================//
interface ProductsPopularItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  ratingAverage?: number;
  ratingCount?: number;
  category: ProductsCategory;
  frameworks: Productsframeworks[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  type: ProductsType;
  paymentType: "free" | "paid";
  created_at: string;
  updated_at: string;
}

interface ProductsPopularPagination {
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface ProductsPopularResponse {
  data: ProductsPopularItem[];
  pagination: ProductsPopularPagination;
}

//====================== Products By Category ======================//
interface ProductsByCategoryItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  category: ProductsCategory;
  type: ProductsType;
  rating: number;
  ratingAverage: number;
  ratingCount: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at: string;
  updated_at: string;
}

interface ProductsByCategoryPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsByCategoryResponse {
  data: ProductsByCategoryItem[];
  pagination: ProductsByCategoryPagination;
}

//====================== Products By Type ======================//
interface ProductsByTypeItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  category: ProductsCategory;
  type: ProductsType;
  rating: number;
  ratingAverage: number;
  ratingCount: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at: string;
  updated_at: string;
}

interface ProductsByTypePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsByTypeResponse {
  data: ProductsByTypeItem[];
  pagination: ProductsByTypePagination;
}

//====================== Products By Tags ======================//
interface ProductsByTagsItem {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  price: number;
  stock: number;
  sold: number;
  downloadCount: number;
  category: ProductsCategory;
  type: ProductsType;
  rating: number;
  ratingAverage: number;
  ratingCount: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at: string;
  updated_at: string;
}

interface ProductsByTagsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsByTagsResponse {
  data: ProductsByTagsItem[];
  pagination: ProductsByTagsPagination;
}
