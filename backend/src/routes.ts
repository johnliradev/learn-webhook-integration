import { Elysia, redirect } from "elysia";
import { health } from "./functions/health";
import { z, ZodError } from "zod";
import { Stripe } from "stripe";
import { env } from "./env";
import {
  createCheckoutInput,
  createCheckoutInputSchema,
} from "./types/checkout.schema";

export const r = new Elysia().get("/", () => "Hello Elysia");

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

r.onError(({ code, status, error }) => {
  if (code === "VALIDATION") return { error: error.customError };
});

r.get("/health", health, {
  response: { 200: z.object({ status: z.string() }) },
});

r.post(
  "/create-checkout-session",
  async (ctx) => {
    const body = ctx.body as createCheckoutInput;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: body.productName,
              images: body.imageUrl ? [body.imageUrl as string] : undefined,
            },
            unit_amount: body.productPrice,
          },
          quantity: 1,
        },
      ],
      customer_email: body.customerEmail,
      mode: "payment",
      success_url: "http://localhost:3000/success",
    });
    if (!session.url) {
      throw new Error("Failed to create checkout session URL");
    }
    console.log(session.url);
    return session.url;
  },
  {
    body: createCheckoutInputSchema,
    response: z.url(),
  }
);
