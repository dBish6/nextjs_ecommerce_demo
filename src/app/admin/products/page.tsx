import Link from "next/link";
import { CheckCircle2, XCircle, MoreVertical } from "lucide-react";

import db from "@model/db";

import { formatCurrency, formatNumber } from "@utils/formatters";

import { deleteProduct } from "@adminActions/products";

import Header from "@adminComponents/Header";
import { Button } from "@components/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@components/Table";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "@adminComponents/tableControls";

const AdminProductsPage: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Header>Products</Header>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductsTable />
    </>
  );
};
export default AdminProductsPage;

const ProductsTable = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      price_cents: true,
      available: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.available ? (
                  <>
                    <span className="sr-only">Available</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-default">
                          <CheckCircle2 />
                        </TooltipTrigger>
                        <TooltipContent>Available</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  <>
                    <span className="sr-only">Unavailable</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-default">
                          <XCircle className="stroke-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>Unavailable</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </TableCell>

              <TableCell>{product.name}</TableCell>

              <TableCell>{formatCurrency(product.price_cents / 100)}</TableCell>

              <TableCell>{formatNumber(product._count.orders)}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Actions</span>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}
                      >
                        Download
                      </a>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>

                    <ActiveToggleDropdownItem
                      id={product.id}
                      available={product.available}
                    />

                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={product.id}
                      action={deleteProduct}
                      disabled={product._count.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
