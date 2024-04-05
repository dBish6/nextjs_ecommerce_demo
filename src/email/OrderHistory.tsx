import { Fragment } from "react";

import {
  Html,
  Preview,
  Tailwind,
  Head,
  Body,
  Container,
  Heading,
  Hr,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";

interface OrderHistoryProps {
  orders: {
    id: string;
    total: number;
    created_at: Date;
    downloadVerificationId: string;
    product: {
      id: string;
      name: string;
      img_path: string;
      description: string;
    };
  }[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderHistory;
