// Use relative paths for same-origin API calls
// Only use absolute URL if explicitly needed for cross-origin requests
// Remove trailing slash if present to avoid double slashes
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(
  /\/$/,
  ""
);

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export const API_CONFIG = {
  ENDPOINTS: {
    signIn: `${API_BASE_URL}/api/auth/signin`,
    signUp: `${API_BASE_URL}/api/auth/signup`,
    signOut: `${API_BASE_URL}/api/auth/signout`,
    verification: `${API_BASE_URL}/api/auth/verification`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    forgetPassword: `${API_BASE_URL}/api/auth/forget-password`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  SECRET: API_SECRET,
};
