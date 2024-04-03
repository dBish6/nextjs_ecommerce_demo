import { Suspense } from "react";

import db from "@model/db";

import cache from "@utils/cache";

import { ProductCardSkeleton } from "@components/ProductCard";
import ProductsContent from "@customerComponents/ProductsContent";

const getProducts = cache(
  () =>
    db.product.findMany({
      where: { available: true },
      orderBy: { name: "asc" },
    }),
  ["/products", "getProducts"]
);

const ProductsPage: React.FC = () => {
  return (
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
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsContent products={getProducts} />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
