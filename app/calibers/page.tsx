"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Cog, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WindingFilter = "all" | "Manual" | "Automatic";

interface ApiWatch {
  id: number;
  title: string;
  description: string;
  price: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
}

interface CaliberSpec {
  code: string;
  name: string;
  winding: "Manual" | "Automatic";
  frequency: string;
  powerReserve: string;
  jewels: string;
  architecture: string;
  summary: string;
}

const CALIBERS: CaliberSpec[] = [
  {
    code: "CAL. CHR-01",
    name: "Openworked Escapement Architecture",
    winding: "Manual",
    frequency: "21,600 vph (3 Hz)",
    powerReserve: "72 Hours",
    jewels: "29 Jewels",
    architecture: "Hand-Beveled Bridges • Twin Mainspring Barrels",
    summary:
      "Engineered for high-contrast architectural visibility, tactile manual winding, and steady torque delivery across three full days.",
  },
  {
    code: "CAL. CHR-04",
    name: "High-Beat Chronometric Movement",
    winding: "Automatic",
    frequency: "28,800 vph (4 Hz)",
    powerReserve: "65 Hours",
    jewels: "27 Jewels",
    architecture: "Bidirectional Rotor • Shock-Absorbed Balance",
    summary:
      "Built for daily precision and rapid energy recovery with a tungsten-weighted oscillating mass and anti-magnetic escapement.",
  },
  {
    code: "CAL. CHR-07",
    name: "Endurance Pressure-Rated Caliber",
    winding: "Automatic",
    frequency: "28,800 vph (4 Hz)",
    powerReserve: "70 Hours",
    jewels: "26 Jewels",
    architecture: "Reinforced Gear Train • Instantaneous Date Jump",
    summary:
      "Calibrated for thermal stability, impact resistance, and uninterrupted legibility in demanding environments.",
  },
];

export default function CalibersPage() {
  const [filter, setFilter] = useState<WindingFilter>("all");
  const [watches, setWatches] = useState<ApiWatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetch("https://dummyjson.com/products/category/mens-watches").then((r) =>
        r.ok ? r.json() : { products: [] }
      ),
      fetch("https://dummyjson.com/products/category/womens-watches").then((r) =>
        r.ok ? r.json() : { products: [] }
      ),
    ])
      .then(([mens, womens]) => {
        if (!active) return;
        setWatches([...(mens.products ?? []), ...(womens.products ?? [])]);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAddToBag = (watch: ApiWatch) => {
    window.dispatchEvent(
      new CustomEvent("chronos:add-to-cart", {
        detail: {
          id: watch.id,
          title: watch.title,
          price: watch.price,
          image: watch.images?.[0] || watch.thumbnail,
        },
      })
    );
  };

  const visibleCalibers =
    filter === "all" ? CALIBERS : CALIBERS.filter((c) => c.winding === filter);

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#050506] px-5 pt-28 pb-20 text-zinc-100 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              [ Mechanical Architecture ]
            </p>
            <h1 className="mt-2 text-3xl font-light tracking-[-0.03em] text-white sm:text-5xl">
              Calibers
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["all", "Manual", "Automatic"] as WindingFilter[]).map((mode) => {
              const active = filter === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilter(mode)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors",
                    active
                      ? "border-white bg-white font-semibold text-black"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/25 hover:text-white"
                  )}
                >
                  {mode === "all" ? "All Calibers" : mode}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {visibleCalibers.map((caliber, cIdx) => {
            const pairedWatches = watches.filter(
              (_, wIdx) => wIdx % CALIBERS.length === cIdx
            );

            return (
              <section
                key={caliber.code}
                className="border border-white/[0.08] bg-[#08080a] p-6 sm:p-8"
              >
                {/* Caliber Top Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-6 lg:flex-row lg:items-center">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.24em] text-zinc-400 uppercase">
                      <Cog className="h-3.5 w-3.5 text-zinc-300" />
                      <span>{caliber.code}</span>
                      <span>•</span>
                      <span className="text-white">{caliber.winding}</span>
                    </div>
                    <h2 className="text-2xl font-light text-white sm:text-3xl">
                      {caliber.name}
                    </h2>
                  </div>

                  <p className="max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {caliber.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-white/[0.07] py-5 sm:grid-cols-4">
                  <div>
                    <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                      FREQUENCY
                    </span>
                    <span className="mt-1 block font-mono text-xs text-zinc-200 sm:text-sm">
                      {caliber.frequency}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                      POWER RESERVE
                    </span>
                    <span className="mt-1 block font-mono text-xs text-zinc-200 sm:text-sm">
                      {caliber.powerReserve}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                      JEWEL COUNT
                    </span>
                    <span className="mt-1 block font-mono text-xs text-zinc-200 sm:text-sm">
                      {caliber.jewels}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                      ARCHITECTURE
                    </span>
                    <span className="mt-1 block font-mono text-xs text-zinc-200 sm:text-sm">
                      {caliber.architecture}
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-zinc-500 uppercase">
                    REFERENCES POWERED BY {caliber.code}
                  </p>

                  {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {[1, 2, 3].map((k) => (
                        <div
                          key={k}
                          className="h-28 animate-pulse border border-white/[0.06] bg-[#0b0b0e]"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {pairedWatches.slice(0, 3).map((watch) => (
                        <div
                          key={watch.id}
                          className="flex flex-col justify-between gap-4 border border-white/[0.07] bg-[#050506] p-4 transition-colors hover:border-white/20"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/[0.06] bg-zinc-950 p-1.5">
                              <img
                                src={watch.images?.[0] || watch.thumbnail}
                                alt={watch.title}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {watch.title}
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
                                {watch.brand ?? watch.category}
                              </p>
                              <p className="mt-1 font-mono text-xs font-semibold text-zinc-200">
                                ${watch.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-3">
                            <Link
                              href={`/timepieces/${watch.id}`}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "h-7 rounded-full border border-white/10 px-3 font-mono text-[10px] tracking-[0.15em] text-zinc-300 uppercase hover:border-white/30 hover:text-white"
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
                                "h-7 rounded-full border-white/15 bg-white/[0.04] px-3 font-mono text-[10px] tracking-[0.15em] text-zinc-200 uppercase hover:border-white hover:bg-white hover:text-black"
                              )}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              <span>Bag</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}