"use client";

import { type Product } from "@prisma/client";

import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { clientStripe } from "@customerConstants/stripe";
import { formatCurrency } from "@utils/formatters";
import { userOrderExists } from "@customerActions/orders";

import { PurchaseProductCard } from "@components/ProductCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@components/Card";
import { Button } from "@components/Button";

interface CheckoutFormProps {
  clientSecret: string;
  product: Product;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  product,
}) => {
  const { price_cents } = product;

  return (
    <div className="max-w-5x1 w-full mx-auto space-y-8">
      <PurchaseProductCard {...product} />

      <Elements stripe={clientStripe} options={{ clientSecret }}>
        <Form productId={product.id} price_cents={price_cents} />
      </Elements>
    </div>
  );
};
export default CheckoutForm;

const Form: React.FC<{ productId: string; price_cents: number }> = ({
  productId,
  price_cents,
}) => {
  const stripe = useStripe(),
    elements = useElements();

  const [loading, setLoading] = useState(false),
    [errorMessage, setErrorMessage] = useState(""),
    [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 500 status page?
    if (stripe == null || elements == null) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const exists = await userOrderExists(email, productId);
      if (exists) {
        return setErrorMessage(
          `You already purchased this product! View "My Orders" to download it.`
        );
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}/purchase/success`,
        },
      });
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error: any) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage.length > 0 && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-1">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={loading || stripe == null || elements == null}
          >
            {loading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(price_cents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
