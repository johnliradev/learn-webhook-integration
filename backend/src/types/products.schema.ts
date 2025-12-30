import { z } from "zod";

export const orderInputSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.email("Invalid email address"),
  productName: z.string().min(1, "Product name is required"),
  productPrice: z.number().min(0.01, "Product price must be greater than 0"),
  productDescription: z
    .string()
    .min(10, "Product description must be at least 10 characters"),
  imageUrl: z.string().optional(),
});

export const orderOutputSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  productName: z.string(),
  productPrice: z.number(),
  productDescription: z.string(),
  imageUrl: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderOutput = z.infer<typeof orderOutputSchema>;
