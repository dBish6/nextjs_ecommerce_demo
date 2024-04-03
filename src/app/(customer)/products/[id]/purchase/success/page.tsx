import { notFound } from "next/navigation";

import db from "@model/db";

import { serverStripe } from "@customerConstants/stripe";
import { PurchaseProductCard } from "@components/ProductCard";

const PurchasePage: React.FC<{
  searchParams: { payment_intent?: string; redirect_status?: string };
}> = async ({ searchParams }) => {
  if (!searchParams.payment_intent) return notFound();

  const paymentIntent = await serverStripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return notFound();

  const success =
    paymentIntent.status === "succeeded" &&
    searchParams.redirect_status === "succeeded";

  return (
    <div className="max-w-5x1 w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {success ? "Purchase Successful!" : "Error ;("}
      </h1>
      <PurchaseProductCard {...product} success={success} />
    </div>
  );
};

export default PurchasePage;
