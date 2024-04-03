"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

import {
  toggleProductAvailability,
  deleteProduct,
} from "@adminActions/products";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";

interface ProductControlsProps {
  product: {
    id: string;
    name: string;
    price_cents: number;
    available: boolean;
    _count: {
      orders: number;
    };
  };
}

const ProductControls: React.FC<ProductControlsProps> = ({ product }) => {
  const [isPending, startTransition] = useTransition(),
    { id, available } = product;

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="sr-only">Actions</span>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a download href={`/admin/products/${id}/download`}>
            Download
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${id}/edit`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              const product = await toggleProductAvailability(id, !available);
              if (product) router.refresh();
            })
          }
          disabled={isPending}
        >
          {available ? "Deactivate" : "Activate"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() =>
            startTransition(async () => {
              const product = await deleteProduct(id);
              if (product) router.refresh();
            })
          }
          disabled={product._count.orders > 0 || isPending}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductControls;
