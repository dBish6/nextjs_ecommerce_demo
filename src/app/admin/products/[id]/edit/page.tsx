import db from "@model/db";
import Header from "@adminComponents/Header";
import ProductForm from "@adminComponents/ProductForm";

const EditProductPage: React.FC<{ params: { id: string } }> = async ({
  params: { id },
}) => {
  const product = await db.product.findUnique({ where: { id } });

  return (
    <>
      <Header>Edit Product</Header>
      <ProductForm product={product} />
    </>
  );
};
export default EditProductPage;
