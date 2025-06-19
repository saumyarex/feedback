import {z} from "zod";

export const usernameValidation = z.string()
    .min(3,{message: "Username must be atleast 3 charaters"})
    .max(20,{message: "Username must under 20 charaters"})
    .regex(/^[a-zA-Z0-9-]+$/,{message: "Username should have only alphabet, number and hypen(-)"})

export const signUpSchema = z.object({
    username: usernameValidation,

    email: z.string().email(),

    password: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message: "Password must have at least one lowercase, uppercase latter, digit and special character from (@$!%*?&)"})
})

