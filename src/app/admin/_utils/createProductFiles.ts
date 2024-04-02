"use server";

import { Product } from "@prisma/client";
import fs from "fs/promises";

const createProductFiles = async (
  data: { file?: File; image?: File },
  product?: Product
) => {
  try {
    let filePath: string | undefined = product && product.file_path,
      imagePath: string | undefined = product && product.img_path;

    // Adds the product page; check if the file exists because for update it's optional.
    if (data.file && data.file.size > 0) {
      product
        ? await fs.unlink(product.file_path)
        : await fs.mkdir("products", { recursive: true });

      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    }

    // Adds the product image to the public directory.
    if (data.image && data.image.size > 0) {
      product
        ? await fs.unlink(`public${product.img_path}`)
        : await fs.mkdir("public/products", { recursive: true });

      imagePath = `/products/${data.image.name.replace(/ /g, "-")}`;
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      );
    }

    return { filePath, imagePath };
  } catch (error: any) {
    console.error("createProductFiles error\n", error.message);
  }
};

export default createProductFiles;
