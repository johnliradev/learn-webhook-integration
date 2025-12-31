import { Elysia, redirect } from "elysia";
import { health } from "./functions/health";
import { string, z } from "zod";
import { createCheckoutInputSchema } from "./types/checkout.schema";
import { createCheckoutSession } from "./functions/post-checkout";
import { successCheckout } from "./functions/success-checkout";

export const r = new Elysia().get("/", () => "Hello Elysia");

// Error handler
r.onError(({ code, status, error }) => {
  // Custom error zod
  if (code === "VALIDATION") return { error: error.customError };
});

r.get("/health", health, {
  response: { 200: z.object({ status: z.string() }) },
});

// Create Checkout Session
r.post(
  "/create-checkout-session",
  async ({ body }) => createCheckoutSession(body),
  {
    body: createCheckoutInputSchema,
    response: z.url(),
  }
);

// Get Success Checkout
r.get("/success", async ({ query }) => successCheckout(query), {
  query: z.object({
    session_id: z.string(),
  }),
  response: z.object({
    payment_status: z.string(),
    amount: z.number(),
    customerName: z.string(),
    customerEmail: z.string(),
  }),
});
