"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WatchCategory = "all" | "mens-watches" | "womens-watches";

interface ApiWatch {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
}

const CATEGORIES: { slug: WatchCategory; label: string }[] = [
  { slug: "all", label: "All Timepieces" },
  { slug: "mens-watches", label: "Men's Watches" },
  { slug: "womens-watches", label: "Women's Watches" },
];

export default function TimepiecesPage() {
  const [selectedCategory, setSelectedCategory] = useState<WatchCategory>("all");
  const [watches, setWatches] = useState<ApiWatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const fetchFromApi = async () => {
      try {
        if (selectedCategory === "all") {
          const [mensRes, womensRes] = await Promise.all([
            fetch("https://dummyjson.com/products/category/mens-watches"),
            fetch("https://dummyjson.com/products/category/womens-watches"),
          ]);

          if (!mensRes.ok || !womensRes.ok) {
            throw new Error("Failed to fetch watches from API");
          }

          const [mensData, womensData] = await Promise.all([
            mensRes.json(),
            womensRes.json(),
          ]);

          if (!active) return;
          setWatches([
            ...(mensData.products ?? []),
            ...(womensData.products ?? []),
          ]);
        } else {
          const res = await fetch(
            `https://dummyjson.com/products/category/${selectedCategory}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch category from API");
          }
          const data = await res.json();
          if (!active) return;
          setWatches(data.products ?? []);
        }
      } catch {
        if (!active) return;
        setError("Could not load timepieces from the API. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchFromApi();

    return () => {
      active = false;
    };
  }, [selectedCategory]);

  const handleAddToBag = (watch: ApiWatch) => {
    setBagCount((c) => c + 1);
    window.dispatchEvent(
      new CustomEvent("chronos:add-to-cart", {
        detail: {
          id: watch.id,
          title: watch.title,
          price: watch.price,
          image: watch.thumbnail,
        },
      })
    );
  };

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#050506] px-5 pt-28 pb-20 text-zinc-100 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header & Category Filter */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              [ Live Catalog ]
            </p>
            <h1 className="mt-2 text-3xl font-light tracking-[-0.03em] text-white sm:text-5xl">
              Timepieces
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors",
                    active
                      ? "border-white bg-white font-semibold text-black"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/25 hover:text-white"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 mb-8 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
          <span>
            {loading
              ? "FETCHING TIMEPIECES..."
              : `${String(watches.length).padStart(2, "0")} TIMEPIECES FOUND`}
          </span>
          {bagCount > 0 && (
            <span className="text-zinc-300">ADDED THIS SESSION: {bagCount}</span>
          )}
        </div>

        {error && (
          <div className="border border-red-500/20 bg-red-950/20 p-6 font-mono text-xs text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[460px] animate-pulse border border-white/[0.06] bg-[#09090b] p-6"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {watches.map((watch, idx) => {
              const displayImage = watch.images?.[0] || watch.thumbnail;
              return (
                <article
                  key={watch.id}
                  className="group flex flex-col justify-between overflow-hidden border border-white/[0.08] bg-[#08080a] transition-all duration-500 hover:border-white/25 hover:bg-[#0b0b0e]"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.12)_0%,rgba(24,24,27,0.45)_52%,#070709_100%)] p-6">
                      {/* Subtle Corner Frame & Top HUD */}
                      <div className="pointer-events-none absolute inset-3 border border-white/[0.05] transition-colors duration-500 group-hover:border-white/[0.12]" />

                      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-zinc-400 uppercase">
                        <span className="bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                          {watch.brand ?? `REF. 0${idx + 1}`}
                        </span>
                        {typeof watch.rating === "number" && (
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-0.5 text-zinc-300 backdrop-blur-sm">
                            <Star className="h-2.5 w-2.5 fill-zinc-300 text-zinc-300" />
                            {watch.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/timepieces/${watch.id}`}
                        className="relative z-10 flex h-[calc(100%-24px)] w-full items-center justify-center pt-2"
                      >
                        <img
                          src={displayImage}
                          alt={watch.title}
                          loading="lazy"
                          className="max-h-full max-w-[82%] object-contain contrast-[1.06] saturate-[1.05] drop-shadow-[0_22px_26px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.06]"
                        />
                      </Link>
                    </div>

                    <div className="space-y-2.5 p-6 pb-0">
                      <p className="font-mono text-[10px] tracking-[0.24em] text-zinc-500 uppercase">
                        {watch.category.replace("-", " ")}
                      </p>

                      <Link href={`/timepieces/${watch.id}`} className="block">
                        <h2 className="text-lg font-medium tracking-tight text-white transition-colors group-hover:text-zinc-200">
                          {watch.title}
                        </h2>
                      </Link>

                      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                        {watch.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.06] p-6 pt-4">
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
                        PRICE
                      </span>
                      <span className="font-mono text-base font-semibold text-white">
                        ${watch.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/Timepieces/${watch.id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "rounded-full border border-white/10 px-3.5 font-mono text-[10px] tracking-[0.16em] text-zinc-300 uppercase hover:border-white/30 hover:text-white"
                        )}
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAddToBag(watch)}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-full border-white/15 bg-white/[0.04] px-4 font-mono text-[10px] tracking-[0.16em] text-zinc-200 uppercase hover:border-white hover:bg-white hover:text-black"
                        )}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}