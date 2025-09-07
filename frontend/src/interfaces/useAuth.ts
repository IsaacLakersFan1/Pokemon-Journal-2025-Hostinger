export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => Promise<void>;
}