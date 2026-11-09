import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  AdminNotificationTemplate,
  OrderCancelledTemplate,
  OrderConfirmationTemplate,
  OrderDeliveredTemplate,
  OrderShippedTemplate,
} from "@/lib/emails/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      customerName = "Customer",
      orderId,
      items = [],
      status = "pending",
      isAdminNotification = false,
    } = body;

    // Handle Admin Notification
    if (isAdminNotification) {
      const recipient =
        process.env.ADMIN_NOTIFICATION_EMAIL ||
        process.env.ADMIN_EMAIL ||
        "Roshe3110@gmail.com";

      await sendEmail({
        to: recipient,
        subject: `New Order Received - #${orderId}`,
        html: AdminNotificationTemplate(orderId, customerName, email, items),
      });
      return NextResponse.json({
        success: true,
        message: "Admin notification sent.",
      });
    }

    // Handle Customer Status Updates
    let subject = "";
    let html = "";

    switch (status) {
      case "pending":
        subject = `Order Confirmation - #${orderId}`;
        html = OrderConfirmationTemplate(customerName, orderId, items);
        break;

      case "shipped":
        subject = `Your Order Has Shipped! - #${orderId}`;
        html = OrderShippedTemplate(customerName, orderId, items);
        break;

      case "delivered":
        subject = `Order Delivered - #${orderId}`;
        html = OrderDeliveredTemplate(customerName, orderId, items);
        break;

      case "cancelled":
        subject = `Order Cancelled - #${orderId}`;
        html = OrderCancelledTemplate(customerName, orderId);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid order status." },
          { status: 400 },
        );
    }

    await sendEmail({
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 },
    );
  }
}
