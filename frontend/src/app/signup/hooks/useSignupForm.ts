import axios from "axios";
import { UseSignupForm } from "../interfaces/useSignupForm";
import { toastError } from "@/hooks/useToastError";
// import { useState } from "react";
import API_URL from "@/utils/apiConfig";
import { toastSuccess } from "@/hooks/useToastSuccess";

export function useSignupForm(): UseSignupForm {

    const { showToastError } = toastError();
    const { showToastSuccess } = toastSuccess();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>, firstName: string, lastName: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToastError("Passwords do not match");
            return false;
        }
        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, {
                firstName: firstName,
                lastName: lastName,
                password,
                email
            });
            showToastSuccess(response.data.message);
            return true;
        } catch (error) {
            showToastError(error);
            return false;
        }
    }

  return {
    handleSignup,
  }
}
