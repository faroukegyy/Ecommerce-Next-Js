"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import BagDrawer, { type CartItem } from "/components/ui/BagDrawer";

export type { CartItem };

export interface NavCategory {
  slug: string;
  name: string;
}

interface AddToCartDetail {
  id: string | number;
  title: string;
  price: number;
  quantity?: number;
  image?: string;
}

interface NavbarProps {
  brandName?: string;
  categories?: NavCategory[];
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string | number, delta: number) => void;
  onRemoveItem?: (id: string | number) => void;
}

const STORAGE_KEY = "chronos_bag_items";

export default function Navbar({
  brandName = "CHRONOS",
  categories = [],
  cartItems: externalItems,
  onUpdateQuantity,
  onRemoveItem,
}: NavbarProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [internalItems, setInternalItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isControlled = externalItems !== undefined;
  const activeItems = isControlled ? externalItems : internalItems;

  const clearCartItems = () => {
    if (!isControlled) {
      setInternalItems([]);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // تجاهل أخطاء التخزين المحلي
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setInternalItems(parsed);
      }
    } catch {
      // تجاهل أخطاء التخزين المحلي
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || isControlled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(internalItems));
    } catch {
      // تجاهل أخطاء التخزين المحلي
    }
  }, [internalItems, hydrated, isControlled]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      const sessionId =
        params.get("session_id") || `${Date.now().toString().slice(-6)}`;
      setSuccessMsg(`تم إتمام الدفع بنجاح (رقم العملية #${sessionId})`);
      setErrorMsg(null);
      clearCartItems();
      setCartOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (paymentStatus === "cancelled") {
      setSuccessMsg(null);
      setErrorMsg("تم إلغاء عملية الدفع.");
      setCartOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleAdd = (event: Event) => {
      const customEvent = event as CustomEvent<AddToCartDetail>;
      const detail = customEvent.detail;
      if (!detail || detail.id === undefined) return;

      const qtyToAdd = Math.max(1, Number(detail.quantity) || 1);
      setSuccessMsg(null);
      setErrorMsg(null);

      setInternalItems((prev) => {
        const idx = prev.findIndex(
          (entry) => String(entry.id) === String(detail.id)
        );
        if (idx > -1) {
          return prev.map((entry, i) =>
            i === idx ? { ...entry, quantity: entry.quantity + qtyToAdd } : entry
          );
        }
        return [
          ...prev,
          {
            id: detail.id,
            title: detail.title,
            price: Number(detail.price) || 0,
            quantity: qtyToAdd,
            image: detail.image,
          },
        ];
      });
    };

    window.addEventListener("chronos:add-to-cart", handleAdd);
    return () => window.removeEventListener("chronos:add-to-cart", handleAdd);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        maxScroll > 0
          ? Math.min(100, Math.max(0, (scrolled / maxScroll) * 100))
          : 0
      );
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const handleQuantityChange = (id: string | number, delta: number) => {
    onUpdateQuantity?.(id, delta);
    if (!isControlled) {
      setInternalItems((prev) =>
        prev
          .map((item) =>
            String(item.id) === String(id)
              ? { ...item, quantity: item.quantity + delta }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    }
  };

  const handleItemRemove = (id: string | number) => {
    onRemoveItem?.(id);
    if (!isControlled) {
      setInternalItems((prev) =>
        prev.filter((item) => String(item.id) !== String(id))
      );
    }
  };

  const navLinks = [
    { href: "/", code: "01", label: "Index" },
    { href: "/Timepieces", code: "02", label: "Timepieces" },
    { href: "/calibers", code: "03", label: "Calibers" },
    { href: "/maison", code: "04", label: "Maison" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div dir="ltr" className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="h-[1.5px] w-full bg-white/[0.06]">
        <div
          className="h-full bg-zinc-200 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="pointer-events-auto group relative inline-flex items-center gap-2.5 bg-zinc-200 px-3.5 py-1.5 text-black shadow-[0_8px_30px_rgba(0,0,0,0.65)] transition-all duration-300 hover:bg-white"
        >
          <span className="h-1.5 w-1.5 bg-black transition-transform duration-300 group-hover:rotate-45" />
          <span className="font-mono text-xs font-black tracking-[0.34em] text-black uppercase sm:text-sm">
            {brandName}
          </span>
        </Link>

        <div className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-1 backdrop-blur-xl md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs tracking-[0.14em] uppercase transition-all duration-300",
                  active
                    ? "bg-white font-semibold text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] transition-opacity",
                    active
                      ? "text-black/70"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  )}
                >
                  {link.code}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}

          {categories.slice(0, 1).map((cat) => (
            <Link
              key={cat.slug}
              href={`/timepieces?category=${encodeURIComponent(cat.slug)}`}
              className="rounded-full px-3.5 py-1.5 text-xs tracking-[0.12em] text-zinc-400 uppercase transition-colors hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <BagDrawer
            open={cartOpen}
            onOpenChange={setCartOpen}
            items={activeItems}
            onUpdateQuantity={handleQuantityChange}
            onRemoveItem={handleItemRemove}
            onClearItems={clearCartItems}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
          />

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9 rounded-full border border-white/10 bg-black/55 text-zinc-200 backdrop-blur-xl hover:bg-zinc-900 hover:text-white"
                )}
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="border-r border-zinc-800/80 bg-[#070708] text-zinc-100"
              >
                <SheetHeader className="border-b border-zinc-800/80 pb-4">
                  <SheetTitle className="inline-block w-fit bg-zinc-200 px-3 py-1 font-mono text-xs font-black tracking-[0.3em] text-black uppercase">
                    {brandName}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-baseline gap-3 text-lg tracking-wide transition-colors",
                        isActive(link.href)
                          ? "font-medium text-white"
                          : "text-zinc-500 hover:text-zinc-200"
                      )}
                    >
                      <span className="font-mono text-xs text-zinc-600">
                        {link.code}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  ))}

                  {categories.slice(0, 3).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/timepieces?category=${encodeURIComponent(cat.slug)}`}
                      onClick={() => setMobileOpen(false)}
                      className="pt-2 font-mono text-xs tracking-[0.18em] text-zinc-400 uppercase hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}