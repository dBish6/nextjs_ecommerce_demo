import db from "@model/db";
import { formatNumber, formatCurrency } from "@utils/formatters";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/Card";

const getProductsData = async () => {
  const [availableCount, notAvailableCount] = await Promise.all([
    db.product.count({ where: { available: true } }),
    db.product.count({ where: { available: false } }),
  ]);

  return { availableCount, notAvailableCount };
};

const getCustomerData = async () => {
  const [customerCount, orderData] = await Promise.all([
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
    }),
  ]);

  return {
    customerCount,
    averageValuePerCustomer:
      customerCount === 0
        ? 0
        : (orderData._sum.total || 0) / customerCount / 100,
  };
};

const getSalesData = async () => {
  const data = await db.order.aggregate({
    _sum: { total: true },
    _count: true,
  });

  return {
    amount: (data._sum.total || 0) / 100,
    numberOfSales: data._count,
  };
};

const AdminDashboard: React.FC = async () => {
  const [productsData, customerData, salesData] = await Promise.all([
      getProductsData(),
      getCustomerData(),
      getSalesData(),
    ]),
    { amount, numberOfSales } = salesData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(
          productsData.notAvailableCount
        )} Not Available`}
      >
        {formatNumber(productsData.availableCount)} Available
      </DashboardCard>

      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          customerData.averageValuePerCustomer
        )} Average Value`}
      >
        {formatNumber(customerData.customerCount)}
      </DashboardCard>

      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(numberOfSales)} Order${
          numberOfSales === 1 ? "" : "s"
        }`}
      >
        {formatCurrency(amount)}
      </DashboardCard>
    </div>
  );
};
export default AdminDashboard;

const DashboardCard: React.FC<
  React.PropsWithChildren<{ title: string; subtitle: string }>
> = ({ children, title, subtitle }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
