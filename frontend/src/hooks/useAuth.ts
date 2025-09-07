import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UseAuthReturn, User } from "@/interfaces/useAuth";


export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToastError } = toastError();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      showToastError("Error al cerrar sesión");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuth
  };
};
