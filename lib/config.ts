// Use relative paths for same-origin API calls
// Only use absolute URL if explicitly needed for cross-origin requests
// Remove trailing slash if present to avoid double slashes
const getBaseUrl = () => {
  // If explicitly set in environment variable, use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  return "";
};

const API_BASE_URL = getBaseUrl();

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

// Helper to construct API endpoint URLs
const createEndpoint = (path: string) => {
  if (API_BASE_URL) {
    // If base URL is set, use absolute URL
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  }
  // Otherwise, use relative path (same-origin)
  return path.startsWith("/") ? path : `/${path}`;
};

export const API_CONFIG = {
  ENDPOINTS: {
    signIn: createEndpoint("/api/auth/signin"),
    signUp: createEndpoint("/api/auth/signup"),
    signOut: createEndpoint("/api/auth/signout"),
    verification: createEndpoint("/api/auth/verification"),
    resetPassword: createEndpoint("/api/auth/reset-password"),
    forgetPassword: createEndpoint("/api/auth/forget-password"),
    changePassword: createEndpoint("/api/auth/change-password"),
    me: createEndpoint("/api/auth/me"),
  },
  SECRET: API_SECRET,
};
