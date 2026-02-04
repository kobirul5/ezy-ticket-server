import Stripe from "stripe";
import config from "../config";

if (!config.stripe.secret_key) {
  throw new Error("STRIPE_SECRET_KEY must be provided");
}

const stripe = new Stripe(config.stripe.secret_key, {
  typescript: true,
});

export default stripe;
