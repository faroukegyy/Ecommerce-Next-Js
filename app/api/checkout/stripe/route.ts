import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd", // غيّرها إلى "egp" إذا كان حسابك يدعم الجنيه المصري
          product_data: {
            name: item.title,
            ...(item.image?.startsWith("http") ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(Number(item.price) * 100), // Stripe يحسب السعر بالسنت/القرش
        },
        quantity: item.quantity,
      })),
      // رابط الرجوع بعد الدفع بنجاح
      success_url: `${siteUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      // رابط الرجوع إذا ضغط المستخدم "رجوع" أو ألغى الدفع
      cancel_url: `${siteUrl}/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err?.message || "حدث خطأ أثناء إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}