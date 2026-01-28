import axios from "axios";
import { UseLoginForm } from "../interfaces/useLoginForm"
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import API_URL from "@/utils/apiConfig";

export function useLoginForm(): UseLoginForm {

    const { showToastError } = toastError();
    const { showToastSuccess } = toastSuccess();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            }, {
                withCredentials: true,
            });
            
            // Verificar autenticación después del login exitoso
            await checkAuth();
            showToastSuccess("Login exitoso");
            navigate("/games");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
            showToastError(errorMessage);
        }
    }

    const addTokenToLocalStorage = (token: string) => {
        localStorage.setItem("BasketballToken", token);
    }

  return {
    handleLogin,
    addTokenToLocalStorage
  }
}
