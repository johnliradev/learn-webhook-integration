import Stripe from "stripe";
import { env } from "../env";
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const successCheckout = async (query: { session_id: string }) => {
  const session = await stripe.checkout.sessions.retrieve(query.session_id);
  if (!session) {
    throw new Error("Failed to Retrieve Session");
  }
  return {
    payment_status: session.payment_status,
    amount: session.amount_total ?? 0,
    customerName: session.customer_details?.name ?? "",
    customerEmail: session.customer_details?.email ?? "",
  };
};
