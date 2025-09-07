import { useState } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";

export function useSyncPokemon() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const syncPokemon = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/pokemon/sync`, {}, {
        withCredentials: true,
      });
      
      showToastSuccess(`Pokemon sincronizados exitosamente: ${response.data.count} Pokemon agregados`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al sincronizar Pokemon";
      showToastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    syncPokemon,
    isLoading,
  };
}
