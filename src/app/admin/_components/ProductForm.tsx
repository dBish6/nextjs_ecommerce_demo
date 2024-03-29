"use client";

import { useState } from "react";

import { Label, Input, Textarea } from "@components/form";
import { Button } from "@components/Button";

import { formatCurrency } from "@utils/formatters";

import { addProducts } from "../_actions/products";

const ProductForm: React.FC = () => {
  const [priceCents, setPriceCents] = useState<number>();

  return (
    <form action={(e) => addProducts(e)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceCents">Price in Cents</Label>
        <Input
          type="number"
          id="priceCents"
          name="priceCents"
          required
          value={priceCents}
          onChange={(e) => setPriceCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency(priceCents || 0 / 100)}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
};

export default ProductForm;
