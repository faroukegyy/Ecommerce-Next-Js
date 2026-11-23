"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, ShieldCheck, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    code: "01",
    title: "Chronometric Testing",
    icon: Compass,
    description:
      "Every movement is regulated across multiple positions and thermal stages to keep daily rate deviation tight and consistent under real wrist wear.",
  },
  {
    code: "02",
    title: "Case & Dial Discipline",
    icon: ShieldCheck,
    description:
      "High-contrast dials, anti-reflective sapphire crystals, and crisp brushed-to-polished transitions engineered for immediate legibility in low light.",
  },
  {
    code: "03",
    title: "Lifecycle & Servicing",
    icon: Wrench,
    description:
      "Full mechanical overhaul, gasket pressure testing, and archival reference verification so each timepiece remains serviceable across decades.",
  },
];

const STANDARDS = [
  { label: "RATE TOLERANCE", value: "-2 / +4 SEC / DAY" },
  { label: "PRESSURE VERIFICATION", value: "MULTI-STAGE SEAL TEST" },
  { label: "ARCHIVE COVERAGE", value: "FULL SERIAL & CALIBER LOG" },
  { label: "CLIENT CONCIERGE", value: "PRIVATE SOURCING & CARE" },
];

export default function MaisonPage() {
  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#050506] px-5 pt-28 pb-20 text-zinc-100 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px] space-y-14">
        {/* Hero / Manifesto Header */}
        <section className="border-b border-white/[0.08] pb-12">
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            [ The House & Philosophy ]
          </p>
          <div className="mt-4 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <h1 className="text-3xl font-light tracking-[-0.03em] text-white sm:text-5xl lg:col-span-7">
              Built around clarity, mechanical discipline, and quiet authority.
            </h1>
            <p className="text-sm leading-relaxed text-zinc-400 lg:col-span-5">
              CHRONOS approaches horology like a precision instrument panel:
              nothing decorative without purpose, every dial element legible at a
              glance, and every reference documented from movement to caseback.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.code}
                className="flex flex-col justify-between border border-white/[0.08] bg-[#08080a] p-6 sm:p-7"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
                    <span>PILLAR {pillar.code}</span>
                    <Icon className="h-4 w-4 text-zinc-300" />
                  </div>
                  <h2 className="text-xl font-medium text-white">
                    {pillar.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {pillar.description}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="border border-white/[0.08] bg-[#08080a] p-6 sm:p-8">
          <p className="mb-6 font-mono text-[10px] tracking-[0.26em] text-zinc-500 uppercase">
            [ Workshop & Service Benchmarks ]
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((item) => (
              <div
                key={item.label}
                className="border-t border-white/[0.08] pt-4"
              >
                <span className="block font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  {item.label}
                </span>
                <span className="mt-1.5 block font-mono text-sm font-medium text-zinc-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-6 border border-white/[0.08] bg-[#09090c] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.24em] text-zinc-500 uppercase">
              [ Continue Exploring ]
            </p>
            <p className="mt-1 text-base font-light text-white sm:text-lg">
              Inspect individual calibers or browse active references in the
              catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calibers"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full border-white/15 bg-white/[0.03] px-5 font-mono text-[11px] tracking-[0.18em] text-zinc-200 uppercase hover:border-white hover:bg-white hover:text-black"
              )}
            >
              <span>Calibers</span>
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>

            <Link
              href="/timepieces"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full bg-white px-5 font-mono text-[11px] font-bold tracking-[0.18em] text-black uppercase hover:bg-zinc-200"
              )}
            >
              <span>Explore Timepieces</span>
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}