interface Transactions {
  _id: string;
  products: TransactionsProducts;
  user: Users;
  paymentMethod: "paid" | "free";
  status: "pending" | "success" | "expired" | "canceled";
  total_amount?: number;
  order_id?: string;
  snap_token?: string;
  payment_details?: {
    payment_type?: string;
    bank?: string;
    va_number?: string;
    transaction_id?: string;
    transaction_time?: string;
    settlement_time?: string;
    currency?: string;
  };
  created_at: string;
  updated_at: string;
}

interface TransactionsProducts {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  downloadUrl?: string;
  paymentType: "free" | "paid";
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  amount: number;
}

interface Users {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  role: UserRole;
}

type UseStateCheckoutSuccessParams = {
  status?: string;
};

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

//====================== Checkout ======================//

interface CheckoutProduct {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  paymentType: "free" | "paid";
}

interface ProductsRatingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: TransactionProduct | null;
  rating: number;
  hoveredRating: number;
  comment: string;
  isSubmittingRating: boolean;
  onRatingChange: (rating: number) => void;
  onHoveredRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

//====================== Transaction Product ======================//

interface TransactionProduct {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  downloadUrl?: string;
  paymentType: "free" | "paid";
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  amount: number;
}

interface Transaction {
  _id: string;
  products: TransactionProduct[];
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    role: string;
  };
  paymentMethod: "paid" | "free";
  status: "pending" | "success" | "expired" | "canceled";
  total_amount?: number;
  order_id?: string;
  snap_token?: string;
  payment_details?: {
    payment_type?: string;
    bank?: string;
    va_number?: string;
    transaction_id?: string;
    transaction_time?: string;
    settlement_time?: string;
    currency?: string;
  };
  created_at: string;
  updated_at: string;
}

interface RatingData {
  hasRated: boolean;
  rating?: {
    _id: string;
    rating: number;
    comment: string;
  };
}

interface CheckoutSuccessProps {
  status?: string;
}

interface CheckoutPageProps {
  searchParams: Promise<{
    products?: string;
    productId?: string;
    title?: string;
  }>;
}

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}
