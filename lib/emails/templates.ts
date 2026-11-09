import { CartItem } from "@/store/cart-store";

export type TemplateItem = Partial<CartItem> & {
  product_name?: string;
  unit_price?: number;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  }).format(price);
};

const renderItemsTable = (items: TemplateItem[]) => {
  if (!items || items.length === 0) return "<p>No items found.</p>";

  const itemsHtml = items
    .map((item) => {
      const name = item.product_name || item.name || "Unknown Product";
      const price = item.unit_price ?? item.price ?? 0;
      const quantity = item.quantity ?? 1;
      
      return `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; vertical-align: middle; margin-right: 10px;" />`
            : ""
        }
        ${name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(price * quantity)}</td>
    </tr>
  `;
    })
    .join("");

  const total = items.reduce(
    (sum, item) => sum + (item.unit_price ?? item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Product</th>
          <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Qty</th>
          <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
          <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right; padding: 10px;">Subtotal:</td>
          <td style="text-align: right; padding: 10px;">${formatPrice(total)}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right; padding: 10px;">Shipping:</td>
          <td style="text-align: right; padding: 10px; color: #28a745;">Free</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold; border-top: 1px solid #ddd;">Order Total:</td>
          <td style="text-align: right; padding: 10px; font-weight: bold; color: #000; border-top: 1px solid #ddd;">${formatPrice(total)}</td>
        </tr>
      </tfoot>
    </table>
  `;
};

export const OrderConfirmationTemplate = (
  customerName: string,
  orderId: string,
  items: TemplateItem[]
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">Hello ${customerName},</h2>
      <p>Thank you for shopping with us! Your order <strong>#${orderId}</strong> has been successfully placed and is currently being processed.</p>
      
      <h3>Order Details:</h3>
      ${renderItemsTable(items)}

      <p style="margin-top: 30px;">We will send you another email once your order has shipped.</p>
      <p>Best regards,<br/><strong>ROSHÉ BEAUTY</strong></p>
    </div>
  `;
};

export const OrderShippedTemplate = (
  customerName: string,
  orderId: string,
  items: TemplateItem[]
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">Great news, ${customerName}!</h2>
      <p>Your order <strong>#${orderId}</strong> has shipped and is on its way to you.</p>
      
      <h3>Shipped Items:</h3>
      ${renderItemsTable(items)}

      <p style="margin-top: 30px;">You can track your order using the link provided on your account dashboard.</p>
      <p>Best regards,<br/><strong>ROSHÉ BEAUTY</strong></p>
    </div>
  `;
};

export const OrderDeliveredTemplate = (
  customerName: string,
  orderId: string,
  items: TemplateItem[]
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">Your order has arrived, ${customerName}!</h2>
      <p>Your order <strong>#${orderId}</strong> has been successfully delivered. We hope you love your new items!</p>
      
      <h3>Delivered Items:</h3>
      ${renderItemsTable(items)}

      <p style="margin-top: 30px;">Thank you for your business. We hope to see you again soon!</p>
      <p>Best regards,<br/><strong>ROSHÉ BEAUTY</strong></p>
    </div>
  `;
};

export const OrderCancelledTemplate = (
  customerName: string,
  orderId: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #d9534f;">Order Cancelled</h2>
      <p>Hello ${customerName},</p>
      <p>We regret to inform you that your order <strong>#${orderId}</strong> has been cancelled.</p>
      <p>If you have any questions or concerns, please reply to this email or contact our support team.</p>
      <p>Best regards,<br/><strong>ROSHÉ BEAUTY</strong></p>
    </div>
  `;
};

export const AdminNotificationTemplate = (
  orderId: string,
  customerName: string,
  customerEmail: string,
  items: TemplateItem[]
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">New Order Received!</h2>
      <p><strong>Order ID:</strong> #${orderId}</p>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      
      <h3>Order Items:</h3>
      ${renderItemsTable(items)}
      
      <p style="margin-top: 30px;">Please login to your admin panel to manage this order.</p>
      <p>Best regards,<br/><strong>ROSHÉ BEAUTY</strong></p>
    </div>
  `;
};

export const AdminLoginFailedAlertTemplate = (
  emailAttempted: string,
  time: string,
  ipAddress?: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #fee2e2; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #dc2626; color: white; padding: 16px 20px;">
        <h2 style="margin: 0; font-size: 18px;">🚨 Security Alert: 3 Failed Login Attempts</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 14px; line-height: 1.5; color: #111;">
          Multiple consecutive failed login attempts (3/3 attempts) were detected on the <strong>ROSHÉ BEAUTY Admin Portal</strong>.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Target Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${emailAttempted}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${time}</td>
          </tr>
          ${
            ipAddress
              ? `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">IP Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${ipAddress}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Lockout Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; color: #dc2626; font-weight: bold;">Temporarily Locked (15 Minutes)</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          If this was you, please wait 15 minutes before trying again. If you did not initiate these attempts, please verify your Supabase credentials immediately.
        </p>
      </div>
    </div>
  `;
};
