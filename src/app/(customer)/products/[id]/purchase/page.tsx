import { notFound } from "next/navigation";

import db from "@model/db";
import { serverStripe } from "@customerConstants/stripe";

import CheckoutForm from "@customerComponents/CheckoutForm";

const PurchasePage: React.FC<{ params: { id: string } }> = async ({
  params: { id },
}) => {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const paymentIntent = await serverStripe.paymentIntents.create({
    amount: product.price_cents,
    currency: "cad",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null)
    throw Error(
      "PurchasePage:\nUnexpected error occurred creating payment intent."
    );

  return (
    <CheckoutForm
      clientSecret={paymentIntent.client_secret}
      product={product}
    />
  );
};

export default PurchasePage;
