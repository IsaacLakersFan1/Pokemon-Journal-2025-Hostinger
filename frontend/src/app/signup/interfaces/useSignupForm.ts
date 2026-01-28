export interface UseSignupForm {
    handleSignup: (e: React.FormEvent<HTMLFormElement>, firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
}

