"use client";

import { useFormState, useFormStatus } from "react-dom";

import { emailOrderHistory } from "@customerActions/orders";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@components/Card";
import { Label, Input } from "@components/form";
import { Button } from "@components/Button";

const OrdersPage: React.FC = () => {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <form action={action} className="max-2-xl mx-auto" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email address and we will send an email to you with your
            order history and download links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-describedby="formError"
              {...(data.error && { "aria-invalid": true })}
              type="email"
              name="email"
              id="email"
              required
            />
            {data.error && (
              <span
                id="formError"
                className="text-sm font-medium text-destructive"
              >
                {data.error}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <span>{data.message}</span> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  );
};
export default OrdersPage;

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? "Sending..." : "Send"}
    </Button>
  );
};
