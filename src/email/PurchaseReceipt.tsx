import { type Product } from "@prisma/client";
import {
  Html,
  Preview,
  Tailwind,
  Head,
  Body,
  Container,
  Heading,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";

interface PurchaseReceiptEmailProps {
  product: Product;
  order: { id: string; created_at: Date; total: number };
  downloadVerificationId: string;
}

const PurchaseReceiptEmail: React.FC<PurchaseReceiptEmailProps> = ({
  product,
  order,
  downloadVerificationId,
}) => {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt.</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              product={product}
              order={order}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PurchaseReceiptEmail;
