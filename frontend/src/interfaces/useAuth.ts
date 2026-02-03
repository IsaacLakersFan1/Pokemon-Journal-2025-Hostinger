export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER" | "admin" | "user";
}

export interface StoredAccount {
  userId: number;
  token: string | null;
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
  logout: () => void;
  checkAuth: () => Promise<void>;
  addAccount: (token: string, user: User) => void;
  removeAccount: (userId: number) => void;
  switchAccount: (token: string) => Promise<void>;
}