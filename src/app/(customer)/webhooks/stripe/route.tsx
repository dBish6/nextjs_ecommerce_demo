import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";

import { serverStripe } from "@customerConstants/stripe";
import db from "@model/db";
import { createDownloadVerification, sendEmail } from "@customerActions/orders";

import PurchaseReceiptEmail from "@email/PurchaseReceipt";

// To check if the payment requests, etc, are actually coming from stripe and sends the confirmation email.
export const POST = async (req: NextRequest) => {
  const event = serverStripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature")!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object,
      productId = charge.metadata.productId,
      email = charge.billing_details.email,
      priceCents = charge.amount;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (product == null || email == null)
      return new NextResponse("Bad Request", { status: 400 });

    const fields = {
      email,
      orders: { create: { product_id: productId, total: priceCents } },
    };
    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: fields,
      update: fields,
      select: { orders: { orderBy: { created_at: "desc" }, take: 1 } },
    });

    const downloadVerificationId = await createDownloadVerification(product.id),
      emailHtml = render(
        <PurchaseReceiptEmail
          product={product}
          order={order}
          downloadVerificationId={downloadVerificationId}
        />
      );

    await sendEmail(email, "Order Confirmation", emailHtml);
  }

  return new NextResponse();
};
