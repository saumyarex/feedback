import axios from "axios";
import { toast } from "sonner"

export function handleFrontendErrors(error: unknown){
    console.log(error)
    if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error);
        toast(error.response?.data.error)
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("An unexpected error occurred");
      }
}


