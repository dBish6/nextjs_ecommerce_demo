import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const serverStripe = new Stripe(process.env.STRIPE_SECRET_KEY!),
  clientStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export { serverStripe, clientStripe };
