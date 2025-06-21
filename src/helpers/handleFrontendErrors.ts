import axios from "axios";
import { toast } from "sonner"

export function handleFrontendErrors(error: unknown, useToast?:false){
    console.error(error)
    if (axios.isAxiosError(error)) {
        console.error(error.response?.data.error);
        if(useToast){
          toast(error.response?.data.error)
        }
      } else if (error instanceof Error) {
        console.error(error.message);
        if(useToast){
          toast(error.message);
        }
      } else {
        console.error("An unexpected error occurred")
        if(useToast){
          toast("An unexpected error occurred");
        }
      }
}


