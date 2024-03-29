import Link from "next/link";

import Header from "../_components/Header";
import { Button } from "@components/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@components/Table";

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

const ProductsTable = () => {
  // TODO: Data table.
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
      <TableBody></TableBody>
    </Table>
  );
};
