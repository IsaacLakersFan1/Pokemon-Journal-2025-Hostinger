// import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export function toastSuccess() {

    const { toast } = useToast();

    const showToastSuccess = (success: any) => {
        const succesMessage = success.response?.data?.message || success.message || success || "An unexpected error occurred";
        toast({
            title: "Action successful",
            description: succesMessage,
            variant: "success",
        })
    }

  return {
    showToastSuccess
  }
  
}
