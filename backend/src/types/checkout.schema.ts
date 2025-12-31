import z from "zod";

export const createCheckoutInputSchema = z.object({
  productName: z.string().min(2, "Product name must have least 2 characters."),
  productPrice: z.number().min(1, "Product Price must have be Positive"),
  customerEmail: z.email("Invalid E-mail.").min(1, "E-mail is required."),
  imageUrl: z
    .string()
    .max(2048, "Product can't have more than 2048 characters.")
    .optional(),
});

export type createCheckoutInput = z.infer<typeof createCheckoutInputSchema>;
