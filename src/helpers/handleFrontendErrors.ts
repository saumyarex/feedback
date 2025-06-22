import axios from "axios";
import { toast } from "sonner"

export function handleFrontendErrors(error: unknown, useToast?:boolean){
    //console.log(error)
    if (axios.isAxiosError(error)) {
        if(useToast){
          toast.error(error.response?.data.message)
        }
      } else if (error instanceof Error) {
        if(useToast){
          toast.error(error.message);
        }
      } else {
        if(useToast){
          toast.error("An unexpected error occurred");
        }
      }
}


