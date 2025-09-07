// import { Toaster } from "@/components/ui/toaster"
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast"

export function toastError() {

    const { toast } = useToast();

    const showToastError = useCallback((error: any) => {
        const errorMessage = error.response?.data?.message || error.message || error || "An unexpected error occurred";
        toast({
            title: "Uh oh! Something went wrong.",
            description: errorMessage,
            variant: "destructive",
        })
    }, [toast]);

  return {
    showToastError
  }
  
}
