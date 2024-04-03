import { type Product } from "@prisma/client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import db from "@model/db";

import cache from "@utils/cache";

import { Button } from "@components/Button";
import { ProductCardSkeleton } from "@components/ProductCard";
import ProductsContent from "./_components/ProductsContent";

const getPopularProducts = cache(
  () =>
    db.product.findMany({
      where: { available: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    }),
  ["/", "getPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(
  () =>
    db.product.findMany({
      where: { available: true },
      orderBy: { created_at: "desc" },
      take: 6,
    }),
  ["/", "getNewestProducts"]
);

const HomePage: React.FC = () => {
  return (
    <main className="space-y-12">
      <ProductsDisplay heading="Popular" products={getPopularProducts} />
      <ProductsDisplay heading="New Arrivals" products={getNewestProducts} />
    </main>
  );
};
export default HomePage;

const ProductsDisplay: React.FC<{
  heading: string;
  products: () => Promise<Product[]>;
}> = ({ heading, products }) => {
  return (
    <section className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{heading}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div
        aria-live="polite"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsContent products={products} />
        </Suspense>
      </div>
    </section>
  );
};
