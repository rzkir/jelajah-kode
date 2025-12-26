import { IAccount } from "@/models/Account";

type UserRole = "admins" | "user";

interface Accounts {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
  status: "active" | "inactive";
  isVerified: "true" | "false";
  provider?: "email" | "github" | "google";
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: Accounts | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<Accounts | undefined>;
  signOut: () => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<Accounts | undefined>;
  signInWithGitHub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithGitHub: () => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
  verifyOtp: (token: string) => Promise<void>;
  finalizeResetPassword: (newPassword: string) => Promise<void>;
}

export interface IAccount extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  picture?: string;
  status: "active" | "inactive";
  isVerified: "true" | "false";
  resetToken?: string;
  resetTokenExpiry?: Date;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  provider?: "email" | "github" | "google";
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(path: string): boolean;
  save(): Promise<this>;
  populate(path: string): Promise<this>;
}
