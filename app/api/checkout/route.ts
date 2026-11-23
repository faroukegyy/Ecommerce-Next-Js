import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buyerName = String(body.buyerName || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const products = Array.isArray(body.products) ? body.products : [];

    if (!buyerName || !phone || !address) {
      return NextResponse.json(
        { error: "اكتب الاسم والتليفون والعنوان الأول" },
        { status: 400 }
      );
    }

    const res = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,
        products: products.map((p: { id: number | string; quantity: number }) => ({
          id: Number(p.id) || 1,
          quantity: Number(p.quantity) || 1,
        })),
        buyer: { buyerName, phone, address },
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      orderId: data.id ?? Date.now(),
    });
  } catch {
    return NextResponse.json(
      { error: "حصلت مشكلة أثناء إرسال الطلب" },
      { status: 500 }
    );
  }
}