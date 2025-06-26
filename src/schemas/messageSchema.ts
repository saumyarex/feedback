import {z} from "zod"


export const messageSchema = z.string().min(10, {message: "Message must be atleast 10 characters"}).max(300, {message: "Message must be less than 300 charaters"})


export const messageFormSchema = z.object({
    content: messageSchema
}
) 