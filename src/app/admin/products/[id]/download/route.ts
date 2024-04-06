import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import fs from "fs/promises";

import db from "@model/db";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const product = await db.product.findUnique({
    where: { id },
    select: { name: true, file_path: true },
  });
  if (product == null) return notFound();

  const [{ size }, file] = await Promise.all([
      fs.stat(product.file_path),
      fs.readFile(product.file_path),
    ]),
    extension = product.file_path.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}`,
      "Content-Length": size.toString(),
    },
  });
};
