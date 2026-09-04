export interface LoginOptions {
  addAccount?: boolean;
}

export interface UseLoginForm {
  handleLogin: (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
    options?: LoginOptions
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
}
