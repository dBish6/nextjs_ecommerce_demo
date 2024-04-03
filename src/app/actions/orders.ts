"use server";

import db from "@model/db";

export const userOrderExists = async (email: string, product_id: string) =>
  (await db.order.findFirst({
    where: { user: { email }, product_id },
    select: { id: true },
  })) !== null;

export const createDownloadVerification = (product_id: string) =>
  db.downloadVerification
    .create({
      data: {
        product_id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24), // One day from now.
      },
    })
    .then((res) => res.id);
