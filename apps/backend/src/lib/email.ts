import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const FROM_EMAIL =
  process.env.FROM_EMAIL ??
  "Fish Shop <onboarding@resend.dev>";

  interface OrderItem {
  name: string;
  quantityGrams: number;
}

interface SendOrderEmailParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: OrderItem[];
}

export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderId,
  totalAmount,
  items,
}: SendOrderEmailParams) {
  if (!customerEmail) return;

  const itemList = items
    .map(
      (item) =>
        `<li>${item.name} - ${item.quantityGrams} g</li>`
    )
    .join("");

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,

      to: customerEmail,

      subject:
        "🐟 Your Fish Shop Order Confirmation",

      html: `
        <h2>வணக்கம் ${customerName}</h2>

        <p>
          உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.
        </p>

        <p>
          <strong>Order ID:</strong>
          ${orderId}
        </p>

        <p>
          <strong>Total Amount:</strong>
          ₹${totalAmount}
        </p>

        <h3>Items</h3>

        <ul>
          ${itemList}
        </ul>

        <p>
          நன்றி.
          <br/>
          Fish Shop
        </p>
      `,
    });

    console.log(
      "Email sent:",
      result
    );
  } catch (err) {
    console.error(
      "Email error:",
      err
    );
  }
}

interface SendOrderStatusEmailParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  status: string;
}

export async function sendOrderStatusEmail({
  customerEmail,
  customerName,
  orderId,
  status,
}: SendOrderStatusEmailParams) {
  if (!customerEmail) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `📦 Order Status Updated`,
      html: `
        <h2>வணக்கம் ${customerName}</h2>

        <p>உங்கள் Order Status மாற்றப்பட்டுள்ளது.</p>

        <p><strong>Order ID</strong><br>${orderId}</p>

        <p><strong>Current Status</strong><br>${status}</p>

        <br>

        <p>Fish Shop</p>
      `,
    });
  } catch (err) {
    console.error(err);
  }
}

interface LowStockEmailParams {
  productName: string;
  remainingStock: number;
}

export async function sendLowStockEmail({
  productName,
  remainingStock,
}: LowStockEmailParams) {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (!adminEmail) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: "⚠ Low Stock Alert",
      html: `
        <h2>Low Stock Alert</h2>

        <p>
          Product :
          <strong>${productName}</strong>
        </p>

        <p>
          Remaining :
          <strong>${remainingStock} g</strong>
        </p>
      `,
    });
  } catch (err) {
    console.error(err);
  }
}

interface PaymentSuccessEmailParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  amount: number;
}

export async function sendPaymentSuccessEmail({
  customerEmail,
  customerName,
  orderId,
  amount,
}: PaymentSuccessEmailParams) {
  if (!customerEmail) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: "✅ Payment Successful",
      html: `
        <h2>Payment Successful</h2>

        <p>
          வணக்கம் ${customerName}
        </p>

        <p>
          உங்கள் Payment வெற்றிகரமாக பெறப்பட்டுள்ளது.
        </p>

        <p>
          Order :
          ${orderId}
        </p>

        <p>
          Amount :
          ₹${amount}
        </p>
      `,
    });
  } catch (err) {
    console.error(err);
  }
}

interface SendOrderCancelledEmailParams {
  email: string;
  customerName: string;
  orderId: string;
  cancelledBy: "CUSTOMER" | "ADMIN";
  reason?: string;
}

export async function sendOrderCancelledEmail({
  email,
  customerName,
  orderId,
  cancelledBy,
  reason,
}: SendOrderCancelledEmailParams) {
  try {
    await resend.emails.send({
      from: "Fish Shop <onboarding@resend.dev>",
      to: email,
      subject: "❌ Order Cancelled",
      html: `
        <h2>Order Cancelled</h2>

        <p>Hi <b>${customerName}</b>,</p>

        <p>Your order has been cancelled.</p>

        <table cellpadding="6">
          <tr>
            <td><b>Order ID</b></td>
            <td>${orderId}</td>
          </tr>

          <tr>
            <td><b>Reason</b></td>
            <td>${reason ?? "Not provided"}</td>
          </tr>
        </table>

        <br/>

        <p>If you wish, you can place a new order anytime.</p>

        <p>Thank you.</p>

        <h3>🐟 Fish Shop</h3>
      `,
    });

    console.log("Order Cancel Email Sent");
  } catch (err) {
    console.error(err);
  }
}