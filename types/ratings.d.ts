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

interface TransactionRatingsProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Rating {
  _id: string;
  productsId: string;
  rating: number;
  comment: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}
