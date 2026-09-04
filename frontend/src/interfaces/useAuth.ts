export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER" | "admin" | "user";
}

export interface StoredAccount {
  userId: number;
  token: string;
  user: User;
}

export interface DisplayAccount {
  user: User;
  token: string | null;
  isCurrent: boolean;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  accounts: DisplayAccount[];
  /** Returns true if another stored account became active after logout. */
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  addAccount: (token: string, user: User) => void;
  removeAccount: (userId: number) => void;
  switchAccount: (token: string) => Promise<User>;
  error: string | null;
  clearError: () => void;
}
