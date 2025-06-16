import {z} from "zod";

export const acceptMessageSchmea = z.object({
    acceptMessages : z.boolean()
})