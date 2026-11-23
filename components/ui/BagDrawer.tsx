"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface BagDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (id: string | number, delta: number) => void;
  onRemoveItem: (id: string | number) => void;
  onClearItems: () => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  successMsg: string | null;
  setSuccessMsg: (msg: string | null) => void;
}

export default function BagDrawer({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearItems,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
}: BagDrawerProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [cardSimOpen, setCardSimOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardProcessing, setCardProcessing] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const resetSubViews = () => {
    setCheckoutOpen(false);
    setCardSimOpen(false);
    setErrorMsg(null);
  };

  const handleSheetChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetSubViews();
    } else if (items.length > 0) {
      setSuccessMsg(null);
    }
  };

  const handleSimulatedCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || cardProcessing) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const digitsOnly = cardNumber.replace(/\D/g, "");
    if (digitsOnly.length < 12) {
      setErrorMsg("أدخل رقم بطاقة صحيح");
      return;
    }

    setCardProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setCardProcessing(false);

    const txId = `${Math.floor(100000 + Math.random() * 900000)}`;
    setSuccessMsg(`تم إتمام الدفع بنجاح (رقم العملية #${txId})`);
    setCardSimOpen(false);
    setCheckoutOpen(false);
    onClearItems();
  };

  const handleSendOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          phone,
          address,
          products: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data?.error || "فشل إرسال الطلب");
        return;
      }

      setSuccessMsg(`تم إرسال طلبك بنجاح (رقم #${data.orderId})`);
      onClearItems();
      setCheckoutOpen(false);
      setBuyerName("");
      setPhone("");
      setAddress("");
    } catch {
      setErrorMsg("مشكلة في الاتصال بالشبكة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetChange}>
      <SheetTrigger
        aria-label="Open shopping bag"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "group h-9 rounded-full border border-white/10 bg-black/55 px-4 text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-zinc-900 hover:text-white"
        )}
      >
        <ShoppingBag className="mr-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
          Bag
        </span>
        <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[10px] font-bold text-black">
          {totalCount}
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-zinc-800/80 bg-[#070708] text-zinc-100 sm:max-w-md"
      >
        <SheetHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-mono text-xs font-bold tracking-[0.28em] text-zinc-200 uppercase">
              {cardSimOpen
                ? "Card Payment"
                : checkoutOpen
                  ? "Buyer Info"
                  : `Acquisition Bag [${String(totalCount).padStart(2, "0")}]`}
            </SheetTitle>
            <button
              type="button"
              onClick={() => handleSheetChange(false)}
              aria-label="Close bag"
              className="rounded-full border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </SheetHeader>

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50">
              <ShoppingBag className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">
                No timepieces selected
              </p>
              <p className="font-mono text-[11px] text-zinc-500">
                SELECT A REFERENCE TO BEGIN
              </p>
            </div>
            <Link
              href="/timepieces"
              onClick={() => handleSheetChange(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full bg-white px-6 font-mono text-[11px] font-bold tracking-[0.2em] text-black uppercase hover:bg-zinc-200"
              )}
            >
              View Timepieces
            </Link>
          </div>
        ) : cardSimOpen ? (
          <form
            onSubmit={handleSimulatedCardSubmit}
            className="flex flex-1 flex-col justify-between py-5"
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setCardSimOpen(false);
                  setErrorMsg(null);
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Bag</span>
              </button>

              {errorMsg && (
                <div className="border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-white outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/29"
                    required
                    className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-white outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    required
                    className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-white outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-zinc-800/80 pt-4">
              <div className="flex items-baseline justify-between font-mono text-sm">
                <span className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                  Total
                </span>
                <span className="font-semibold text-white">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={cardProcessing}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 w-full rounded-full bg-white font-mono text-xs font-bold tracking-[0.2em] text-black uppercase hover:bg-zinc-200 disabled:opacity-60"
                )}
              >
                {cardProcessing
                  ? "Processing..."
                  : `Pay $${subtotal.toLocaleString()}`}
              </button>
            </div>
          </form>
        ) : checkoutOpen ? (
          <form
            onSubmit={handleSendOrder}
            className="flex flex-1 flex-col justify-between py-5"
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setCheckoutOpen(false);
                  setErrorMsg(null);
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Bag</span>
              </button>

              {errorMsg && (
                <div className="border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="الاسم"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 text-sm text-white outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم التليفون"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 text-sm text-white outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="العنوان"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 text-sm text-white outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-zinc-800/80 pt-4">
              <div className="flex items-baseline justify-between font-mono text-sm">
                <span className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                  Total
                </span>
                <span className="font-semibold text-white">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 w-full rounded-full bg-white font-mono text-xs font-bold tracking-[0.2em] text-black uppercase hover:bg-zinc-200 disabled:opacity-60"
                )}
              >
                {submitting ? "Sending..." : "Send Order"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition-colors hover:border-zinc-700"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-11 w-11 shrink-0 bg-zinc-950 object-contain p-1"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {item.title}
                      </p>
                      <p className="mt-1 font-mono text-xs text-zinc-400">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center border border-zinc-800 bg-black text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center font-mono text-xs text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center border border-zinc-800 bg-black text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                      className="ml-1 flex h-7 w-7 items-center justify-center border border-zinc-800/70 bg-black/60 text-zinc-500 transition-colors hover:border-red-500/40 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 border-t border-zinc-800/80 pt-4">
              <div className="flex items-baseline justify-between pb-1">
                <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  Estimated Total
                </span>
                <span className="font-mono text-lg font-semibold text-white">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              {errorMsg && (
                <div className="border border-red-500/30 bg-red-950/30 p-2.5 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setCheckoutOpen(false);
                  setCardSimOpen(true);
                }}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 w-full rounded-full bg-white font-mono text-xs font-bold tracking-[0.2em] text-black uppercase transition-transform active:scale-[0.99] hover:bg-zinc-200"
                )}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Credit Card
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setCardSimOpen(false);
                  setCheckoutOpen(true);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 w-full rounded-full border-zinc-700 bg-transparent font-mono text-[11px] tracking-[0.2em] text-zinc-300 uppercase hover:bg-zinc-900 hover:text-white"
                )}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}