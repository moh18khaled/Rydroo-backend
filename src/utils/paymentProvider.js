// minimal Stripe helper (install stripe if you use it)
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = "usd", metadata = {}) => {
  return stripe.paymentIntents.create({ amount, currency, metadata });
};

export default { createPaymentIntent };