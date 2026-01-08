const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export const API_CONFIG = {
  ENDPOINTS: {
    base: API_BASE_URL,
    signIn: `${API_BASE_URL}/api/auth/signin`,
    signUp: `${API_BASE_URL}/api/auth/signup`,
    signOut: `${API_BASE_URL}/api/auth/signout`,
    verification: `${API_BASE_URL}/api/auth/verification`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    forgetPassword: `${API_BASE_URL}/api/auth/forget-password`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`,
    me: `${API_BASE_URL}/api/auth/me`,
    uploadPicture: `${API_BASE_URL}/api/auth/upload-picture`,
    products: {
      base: `${API_BASE_URL}/api/products`,
      categories: `${API_BASE_URL}/api/products/categories`,
      framework: `${API_BASE_URL}/api/products/framework`,
      frameworkUpload: `${API_BASE_URL}/api/products/framework/upload`,
      frameworkById: (id: string) =>
        `${API_BASE_URL}/api/products/framework?id=${id}`,
      tags: `${API_BASE_URL}/api/products/tags`,
      type: `${API_BASE_URL}/api/products/type`,
      upload: `${API_BASE_URL}/api/products/upload`,
      byId: (id: string) => `${API_BASE_URL}/api/products?id=${id}`,
      byProductsId: (productsId: string) =>
        `${API_BASE_URL}/api/products/${productsId}`,
      search: (params: URLSearchParams) =>
        `${API_BASE_URL}/api/products/search?${params.toString()}`,
      discount: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/api/products/discount?page=${page}&limit=${limit}`,
      mostSaled: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/api/products/most-saled?page=${page}&limit=${limit}`,
      popular: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/api/products/popular?page=${page}&limit=${limit}`,
      ratings: (productsId: string, page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/api/ratings/${productsId}?page=${page}&limit=${limit}`,
    },
    checkout: `${API_BASE_URL}/api/checkout`,
    transactions: `${API_BASE_URL}/api/transactions`,
    transactionsUpdate: `${API_BASE_URL}/api/transactions/update`,
    ratings: `${API_BASE_URL}/api/ratings`,
  },
  SECRET: API_SECRET,
  SOCIAL_MEDIA: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  },
};
