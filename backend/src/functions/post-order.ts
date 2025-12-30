import { OrderInput } from "../types/products.schema";

export const postOrder = async (body: OrderInput) => {
  const orderId = crypto.randomUUID();
  return { ...body, orderId };
};
