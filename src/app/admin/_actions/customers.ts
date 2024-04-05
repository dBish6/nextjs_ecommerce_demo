"use server";

import { notFound } from "next/navigation";
import db from "@model/db";

export const deleteUser = async (id: string) => {
  const user = await db.user.delete({ where: { id } });
  if (user == null) return notFound();

  return user;
};
