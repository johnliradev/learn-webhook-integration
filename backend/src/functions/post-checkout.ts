import Stripe from "stripe";
import { createCheckoutInput } from "../types/checkout.schema";
import { env } from "../env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (body: createCheckoutInput) => {
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
    success_url:
      "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
  });
  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }
  return session.url;
};
