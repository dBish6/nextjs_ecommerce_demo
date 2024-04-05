"use server";

import { z } from "zod";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

import db from "@model/db";

import OrderHistory from "@email/OrderHistory";

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

export const sendEmail = async (
  toEmail: string,
  subject: string,
  emailHtml: string
) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
    process.env;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    // secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    debug: true,
    logger: true,
  });

  transporter.verify((error) => {
    if (error) {
      const errorMsg = "sendReceptEmail verify error:\n" + error.message;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  });

  return await transporter.sendMail({
    from: `"David Bishop - the Dev :D" <${SMTP_FROM}>`,
    to: toEmail,
    subject: subject,
    html: emailHtml,
  });
};

const emailSchema = z.string().email();
export const emailOrderHistory = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> => {
  const result = emailSchema.safeParse(formData.get("email"));
  if (!result.success) return { error: "Invalid email address." };

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          total: true,
          created_at: true,
          product: {
            select: {
              id: true,
              name: true,
              img_path: true,
              description: true,
            },
          },
        },
      },
    },
  });
  if (user == null)
    return {
      message:
        "Check your email to view your order history and download your products.",
    };

  const orders = user.orders.map(async (order) => {
      return {
        ...order,
        downloadVerificationId: await createDownloadVerification(
          order.product.id
        ),
      };
    }),
    emailHtml = render(<OrderHistory orders={await Promise.all(orders)} />);

  const res = await sendEmail(user.email, "Order Confirmation", emailHtml);
  if (res.rejected.length) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
};

// return {
//   ...order,
//   downloadVerificationId: (
//     await db.downloadVerification.create({
//       data: {
//         product_id: order.product.id,
//         expires_at: new Date(Date.now() + 24 * 1000 * 60 * 60),
//       },
//     })
//   ).id,
// }
