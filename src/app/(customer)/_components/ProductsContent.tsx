import { type Product } from "@prisma/client";
import { ProductCard } from "@components/ProductCard";

const ProductsContent: React.FC<{
  products: () => Promise<Product[]>;
}> = async ({ products }) => {
  return (await products()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
};

export default ProductsContent;
