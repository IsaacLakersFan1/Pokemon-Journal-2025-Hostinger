export interface UseLoginForm {
    handleLogin: (e: React.FormEvent<HTMLFormElement>, username: string, password: string) => void;
    addTokenToLocalStorage: (token: string) => void;
}

