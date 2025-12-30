import { Elysia } from "elysia";
import { health } from "./functions/health";
import { z, ZodError } from "zod";
import { postOrder } from "./functions/post-order";
import {
  OrderInput,
  orderInputSchema,
  orderOutputSchema,
} from "./types/products.schema";

export const r = new Elysia().get("/", () => "Hello Elysia");

r.onError(({ code, status, error }) => {
  if (code === "VALIDATION") return { error: error.customError };
});

r.get("/health", health, {
  response: { 200: z.object({ status: z.string() }) },
});

r.post("/order", async ({ body }: { body: OrderInput }) => postOrder(body), {
  body: orderInputSchema,
  response: { 200: orderOutputSchema },
});
