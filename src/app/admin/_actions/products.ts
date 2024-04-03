"use server";

import { z } from "zod";
import fs from "fs/promises";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import db from "@model/db";

import createProductFiles from "@adminUtils/createProductFiles";

const updateCaches = () => {
  revalidatePath("/");
  revalidatePath("/products");
};

const requiredMessage = "Required";

const fileSchema = z.instanceof(File, { message: requiredMessage }),
  imageSchema = fileSchema.refine(
    // FIXME: Formats.
    (file) => file.size === 0 || file.type.startsWith("image/")
  );

const addProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, requiredMessage),
  image: imageSchema.refine((file) => file.size > 0, requiredMessage),
});
export const addProduct = async (prevState: unknown, formData: FormData) => {
  const result = addProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const data = result.data,
    paths = await createProductFiles(data);

  if (paths) {
    await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price_cents: data.priceCents,
        file_path: paths.filePath!,
        img_path: paths.imagePath!,
        available: false,
      },
    });

    updateCaches();
    redirect("/admin/products");
  } else {
    return notFound();
  }
};

const editProductSchema = addProductSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});
export const editProduct = async (
  id: string,
  prevState: unknown,
  formData: FormData
) => {
  const result = editProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const data = result.data,
    product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const paths = await createProductFiles(data, product);

  if (paths) {
    await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price_cents: data.priceCents,
        file_path: paths.filePath,
        img_path: paths.imagePath,
        available: false,
      },
    });

    updateCaches();
    redirect("/admin/products");
  } else {
    return notFound();
  }
};

export const deleteProduct = async (id: string) => {
  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  await Promise.all([
    fs.unlink(product.file_path),
    fs.unlink(`public${product.img_path}`),
  ]);

  updateCaches();
  return product;
};

export const toggleProductAvailability = async (
  id: string,
  available: boolean
) => {
  const product = await db.product.update({
    where: { id },
    data: { available },
  });
  if (product == null) return notFound();

  updateCaches();
  return product;
};
