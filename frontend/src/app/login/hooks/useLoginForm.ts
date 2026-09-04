import { useState } from "react";
import axios from "axios";
import { LoginOptions, UseLoginForm } from "../interfaces/useLoginForm";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import API_URL from "@/utils/apiConfig";
import { User } from "@/interfaces/useAuth";

export function useLoginForm(): UseLoginForm {
  const { showToastSuccess } = toastSuccess();
  const navigate = useNavigate();
  const { checkAuth, addAccount } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
    options?: LoginOptions
  ) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const { token, user } = response.data as {
        token?: string;
        user?: User;
      };
      if (!token || !user) {
        setError("Respuesta de login incompleta. Inténtalo de nuevo.");
        return;
      }

      addAccount(token, user);
      await checkAuth();
      showToastSuccess(
        options?.addAccount
          ? "Cuenta agregada correctamente"
          : "Inicio de sesión exitoso"
      );
      navigate("/games", { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      setError(message || "No se pudo iniciar sesión. Revisa tus datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleLogin,
    isSubmitting,
    error,
    clearError,
  };
}
