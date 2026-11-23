"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FooterCategory {
  slug: string;
  name: string;
}

interface FooterProps {
  brandName?: string;
  categories?: FooterCategory[];
}

export default function Footer({
  brandName = "CHRONOS",
  categories = [],
}: FooterProps) {
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        maxScroll > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)))
          : 100;
      setScrollDepth(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const primaryLinks = [
    { href: "/", code: "01", label: "Index" },
    { href: "/Timepieces", code: "02", label: "Timepieces" },
    { href: "/calibers", code: "03", label: "Calibers" },
    { href: "/maison", code: "04", label: "Maison" },
  ];

  return (
    <footer
      dir="ltr"
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#050506] text-zinc-200"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="mx-auto max-w-[1440px] px-5 pt-16 pb-10 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 border-b border-white/[0.07] pb-12 md:flex-row md:items-end">
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 bg-zinc-200 px-4 py-2 text-black shadow-[0_10px_35px_rgba(0,0,0,0.75)] transition-all duration-300 hover:bg-white"
            >
              <span className="h-2 w-2 bg-black transition-transform duration-300 group-hover:rotate-45" />
              <span className="font-mono text-sm font-black tracking-[0.36em] text-black uppercase sm:text-base">
                {brandName}
              </span>
            </Link>

            <p className="max-w-md text-xs leading-relaxed tracking-wide text-zinc-400">
              Precision horology rendered in real-time motion. Engineered for
              depth, tactile acoustics, and architectural clarity across every
              reference.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-200" />
              <span>3D STAGE // READY</span>
            </div>
            <div className="border-l border-white/10 pl-6">
              <span>DEPTH {String(scrollDepth).padStart(3, "0")}%</span>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 rounded-full border border-white/10 bg-white/[0.03] px-4 font-mono text-[10px] tracking-[0.22em] text-zinc-300 uppercase transition-all hover:border-white/30 hover:bg-white hover:text-black"
              )}
            >
              <span>Ascend</span>
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.07] py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              [ Navigation ]
            </p>
            <ul className="space-y-2.5">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-3 text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[11px] text-zinc-600 transition-colors group-hover:text-zinc-300">
                      {item.code}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              [ Curated Divisions ]
            </p>
            <ul className="space-y-2.5">
              {(categories.length > 0
                ? categories.slice(0, 4)
                : [
                    { slug: "tourbillon", name: "Tourbillon Series" },
                    { slug: "chronograph", name: "Chronograph Lab" },
                    { slug: "diver", name: "Abyssal Divers" },
                    { slug: "skeleton", name: "Openworked Calibers" },
                  ]
              ).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/watches?category=${encodeURIComponent(cat.slug)}`}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 bg-zinc-700 transition-all duration-300 group-hover:w-3 group-hover:bg-white" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              [ Acquisition & Care ]
            </p>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  href="/checkout"
                  className="transition-colors hover:text-white"
                >
                  Private Acquisition & Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="transition-colors hover:text-white"
                >
                  5-Year Mechanical Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-white"
                >
                  Boutique Concierge
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 font-mono text-[11px] tracking-[0.18em] text-zinc-600 uppercase sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {brandName} HOROLOGY. ALL RIGHTS RESERVED.
          </p>
          <p>REAL-TIME MOTION •</p>
        </div>
      </div>
    </footer>
  );
}