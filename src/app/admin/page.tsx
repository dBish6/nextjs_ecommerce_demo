import db from "@model/db";
import { formatNumber, formatCurrency } from "@utils/formatters";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/Card";

const getSalesData = async () => {
  const data = await db.order.aggregate({
    _sum: { total: true },
    _count: true,
  });

  return {
    amount: (data._sum.total || 0) / 1000,
    numberOfSales: data._count,
  };
};

const getCustomerData = async () => {
  const [customerCount, orderData] = await Promise.all([
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
      //   _count: true,
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

const getStockData = async () => {
  const [availableCount, notAvailableCount] = await Promise.all([
    db.product.count({ where: { available: true } }),
    db.product.count({ where: { available: false } }),
  ]);

  return { availableCount, notAvailableCount };
};

const AdminDashboard: React.FC = async () => {
  const [salesData, customerData, stockData] = await Promise.all([
      getSalesData(),
      getCustomerData(),
      getStockData(),
    ]),
    { amount, numberOfSales } = salesData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(numberOfSales)} Order${
          numberOfSales === 1 ? "" : "s"
        }`}
      >
        {formatCurrency(amount)}
      </DashboardCard>

      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          customerData.averageValuePerCustomer
        )} Average Value`}
      >
        {formatNumber(customerData.customerCount)}
      </DashboardCard>

      {/* Total? */}
      <DashboardCard
        title="Stock"
        subtitle={`${formatNumber(stockData.notAvailableCount)} Not Available`}
      >
        {formatNumber(stockData.availableCount)} Available
      </DashboardCard>
    </div>
  );
};
export default AdminDashboard;

export const DashboardCard: React.FC<
  React.PropsWithChildren<{ title: string; subtitle: string }>
> = ({ children, title, subtitle }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {/* <CardFooter>
<p>Card Footer</p>
</CardFooter> */}
    </Card>
  );
};
