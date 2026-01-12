const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const API_SECRET = process.env.API_SECRET;

const API_CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL;

export const API_CONFIG = {
  ENDPOINTS: {
    base: API_BASE_URL,
    signIn: `${API_BASE_URL}/auth/signin`,
    signUp: `${API_BASE_URL}/auth/signup`,
    signOut: `${API_BASE_URL}/auth/signout`,
    verification: `${API_BASE_URL}/auth/verification`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    forgetPassword: `${API_BASE_URL}/auth/forget-password`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
    deleteAccount: `${API_BASE_URL}/auth/delete-account`,
    me: `${API_BASE_URL}/auth/me`,
    uploadPicture: `${API_BASE_URL}/auth/upload-picture`,
    products: {
      base: `${API_BASE_URL}/products`,
      categories: `${API_BASE_URL}/products/categories`,
      framework: `${API_BASE_URL}/products/framework`,
      frameworkUpload: `${API_BASE_URL}/products/framework/upload`,
      frameworkById: (id: string) =>
        `${API_BASE_URL}/products/framework?id=${id}`,
      tags: `${API_BASE_URL}/products/tags`,
      type: `${API_BASE_URL}/products/type`,
      upload: `${API_BASE_URL}/products/upload`,
      byId: (id: string) => `${API_BASE_URL}/products?id=${id}`,
      byProductsId: (productsId: string) =>
        `${API_BASE_URL}/products/${productsId}`,
      search: (params: URLSearchParams) =>
        `${API_BASE_URL}/products/search?${params.toString()}`,
      discount: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/products/discount?page=${page}&limit=${limit}`,
      mostSaled: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/products/most-saled?page=${page}&limit=${limit}`,
      popular: (page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/products/popular?page=${page}&limit=${limit}`,
      ratings: (productsId: string, page: number = 1, limit: number = 10) =>
        `${API_BASE_URL}/ratings/${productsId}?page=${page}&limit=${limit}`,
      byCategory: (
        categoryId: string,
        page: number = 1,
        limit: number = 10,
        sort: string = "newest"
      ) =>
        `${API_BASE_URL}/products/categories/${categoryId}?page=${page}&limit=${limit}&sort=${sort}`,
      byType: (
        typeId: string,
        page: number = 1,
        limit: number = 10,
        sort: string = "newest"
      ) =>
        `${API_BASE_URL}/products/type/${typeId}?page=${page}&limit=${limit}&sort=${sort}`,
      byTags: (
        tagsId: string,
        page: number = 1,
        limit: number = 10,
        sort: string = "newest"
      ) =>
        `${API_BASE_URL}/products/tags/${tagsId}?page=${page}&limit=${limit}&sort=${sort}`,
    },
    articles: {
      base: `${API_BASE_URL}/articles`,
      categories: `${API_BASE_URL}/articles/categories`,
      tags: `${API_BASE_URL}/articles/tags`,
      byId: (id: string) => `${API_BASE_URL}/articles?id=${id}`,
      byArticlesId: (articlesId: string) =>
        `${API_BASE_URL}/articles/${articlesId}`,
      byCategory: (
        categoryId: string,
        page: number = 1,
        limit: number = 10,
        sort: string = "newest"
      ) =>
        `${API_BASE_URL}/articles/categories/${categoryId}?page=${page}&limit=${limit}&sort=${sort}`,
    },
    checkout: `${API_BASE_URL}/checkout`,
    ratings: `${API_BASE_URL}/ratings`,
    transactions: `${API_BASE_URL}/transactions`,
    users: {
      base: `${API_BASE_URL}/users`,
    },
    chat: {
      academia: `${API_CHAT_BASE_URL}/edu/academia`,
      curhat: `${API_CHAT_BASE_URL}/personal/curhat`,
    },
  },
  SECRET: API_SECRET,
  SOCIAL_MEDIA: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  },
};
