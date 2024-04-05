"use server";

import { notFound } from "next/navigation";
import db from "@model/db";

export const deleteOrder = async (id: string) => {
  const order = await db.order.delete({ where: { id } });
  if (order == null) return notFound();

  return order;
};
