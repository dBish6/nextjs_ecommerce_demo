import { MoreVertical } from "lucide-react";

import db from "@model/db";

import { formatCurrency, formatNumber } from "@utils/formatters";

import { deleteUser } from "@adminActions/customers";

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

const CustomersPage: React.FC = () => {
  return (
    <>
      <Header>Customers</Header>
      <CustomersTable />
    </>
  );
};
export default CustomersPage;

const CustomersTable = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { total: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce((sum, order) => order.total + sum, 0) / 100
              )}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={user.id} action={deleteUser} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
