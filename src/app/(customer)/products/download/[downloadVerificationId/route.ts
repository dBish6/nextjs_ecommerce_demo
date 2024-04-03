import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

import db from "@model/db";

export const GET = async (
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) => {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expires_at: { gt: new Date() } },
    select: { product: { select: { file_path: true, name: true } } },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  const [{ size }, file] = await Promise.all([
      fs.stat(data.product.file_path),
      fs.readFile(data.product.file_path),
    ]),
    extension = data.product.file_path.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
};
