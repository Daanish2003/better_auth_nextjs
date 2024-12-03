import { z } from "zod";

export const PassKeyFormSchema = z.object({
    passkeyName: z.string().min(1)
})