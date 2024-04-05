import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@utils/formatters";
import { createDownloadVerification } from "@customerActions/orders";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
import { Button } from "./Button";

interface ProductCardProps {
  id: string;
  name: string;
  price_cents: number;
  description: string;
  img_path: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price_cents,
  description,
  img_path,
}) => {
  return (
    <Card aria-busy="false" className="flex flex-col overflow-hidden">
      <div className="relative w-full h-auto aspect-video">
        <Image src={img_path} alt={name} fill />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(price_cents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <Card
      role="status"
      aria-label="Loading Products Section"
      aria-busy="true"
      className="flex flex-col overflow-hidden animate-pulse"
    >
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
};

const PurchaseProductCard: React.FC<
  ProductCardProps & { success?: boolean }
> = ({ id, img_path, name, price_cents, description, success }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-shrink-0 w-1/3 aspect-video">
        <Image src={img_path} alt={name} className="object-fit" fill />
      </div>
      <div>
        <div className="text-lg">{formatCurrency(price_cents / 100)}</div>
        <h1 className="text-2xl">{name}</h1>
        <div className="line-clamp-3 md:line-clamp-none text-muted-foreground">
          <p>{description}</p>
        </div>
        {success && (
          <Button className="mt-4" size="lg" asChild>
            {success ? (
              <a href={`/products/download/${createDownloadVerification(id)}`}>
                Download
              </a>
            ) : (
              <Link href={`/products/${id}/purchase`}>Try Again</Link>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export { ProductCard, ProductCardSkeleton, PurchaseProductCard };
