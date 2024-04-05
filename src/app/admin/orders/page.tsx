import { MoreVertical } from "lucide-react";

import db from "@model/db";

import { formatCurrency } from "@utils/formatters";

import { deleteOrder } from "@adminActions/orders";

import Header from "@adminComponents/Header";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@components/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import { DeleteDropdownItem } from "@adminComponents/tableControls";

const OrdersPage: React.FC = () => {
  return (
    <>
      <Header>Sales</Header>
      <OrdersTable />
    </>
  );
};
export default OrdersPage;

const OrdersTable = async () => {
  const orders = await db.order.findMany({
    select: {
      id: true,
      total: true,
      user: { select: { email: true } },
      product: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>{formatCurrency(order.total / 100)}</TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={order.id} action={deleteOrder} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
