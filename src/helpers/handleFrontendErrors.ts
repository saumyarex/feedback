import axios from "axios";
import { toast } from "sonner"

export function handleFrontendErrors(error: unknown, useToast?:boolean){
    console.error(error)
    if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        if(useToast){
          toast.error(error.response?.data.message)
        }
      } else if (error instanceof Error) {
        console.error(error.message);
        if(useToast){
          toast.error(error.message);
        }
      } else {
        console.error("An unexpected error occurred")
        if(useToast){
          toast.error("An unexpected error occurred");
        }
      }
}


