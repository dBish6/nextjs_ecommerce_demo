"use client";

import { Product } from "@prisma/client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";

import { formatCurrency } from "@utils/formatters";

import { addProduct, editProduct } from "../_actions/products";

import { Label, Input, Textarea } from "@components/form";
import { Button } from "@components/Button";

const ProductForm: React.FC<{ product?: Product | null }> = ({ product }) => {
  const [priceCents, setPriceCents] = useState<number | undefined>(
    product?.price_cents
  );

  const [error, action] = useFormState(
      product == null ? addProduct : editProduct.bind(null, product.id),
      {}
    ),
    { pending } = useFormStatus();

  return (
    <form action={action} className="space-y-8" autoComplete="off" noValidate>
      <FormInput
        label="Name"
        id="name"
        name="name"
        error={error?.name}
        defaultValue={product?.name}
      />

      <FormInput
        label="Price in Cents"
        id="priceCents"
        name="priceCents"
        type="number"
        error={error?.priceCents}
        value={priceCents}
        onChange={(e) => setPriceCents(Number(e.target.value) || undefined)}
      >
        <div className="text-muted-foreground">
          {formatCurrency((priceCents || 0) / 100)}
        </div>
      </FormInput>

      <FormInput
        label="Description"
        id="description"
        name="description"
        error={error?.description}
        defaultValue={product?.description}
      />

      <FormInput
        label="File"
        id="file"
        name="file"
        type="file"
        error={error?.file}
        required={product == null}
      >
        {product != null && (
          <div className="text-muted-foreground">
            {product.file_path.split("products/")[1]}
          </div>
        )}
      </FormInput>

      <FormInput
        label="Image"
        id="image"
        name="image"
        type="file"
        error={error?.file}
        required={product == null}
      >
        {product != null && (
          <Image
            src={product.img_path}
            height="400"
            width="400"
            alt="Product Image"
          />
        )}
      </FormInput>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
export default ProductForm;

const FormInput: React.FC<
  React.PropsWithChildren<
    {
      label: string;
      id: string;
      name: string;
      defaultValue?: string;
      error?: string[];
    } & React.ComponentProps<"input">
  >
> = ({ children, label, id, name, error, ...options }) => {
  const InputType = name === "description" ? Textarea : Input,
    Element = InputType as typeof Input;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Element
        aria-describedby="formError"
        {...(error && { "aria-invalid": true })}
        id={id}
        name={name}
        required
        {...options}
      />
      {children}
      {error && (
        <span id="formError" className="text-xs font-medium text-destructive">
          {error[0]}
        </span>
      )}
    </div>
  );
};
