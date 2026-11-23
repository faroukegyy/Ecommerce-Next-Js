"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCw } from "lucide-react";
import WatchScene3D from "@/components/ui/WatchScene3D";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollShift = Math.min(90, scrollY * 0.22);

  return (
    <div dir="ltr" className="min-h-screen bg-[#050506] text-zinc-100">
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20 pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(255,255,255,0.07),transparent_55%)]"
        />

        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          {/* Animated Copy Before Watch */}
          <div
            style={{ transform: `translateY(${-scrollShift * 0.45}px)` }}
            className="space-y-6 transition-transform duration-150 ease-out lg:col-span-5"
          >
            <div
              className={cn(
                "inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-zinc-400 uppercase transition-all duration-700 ease-out",
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <RotateCw
                className="h-3 w-3 animate-spin text-zinc-200"
                style={{ animationDuration: "9s" }}
              />
              <span>REAL-TIME 3D CALIBER</span>
            </div>

            <h1
              className={cn(
                "text-4xl font-light tracking-[-0.03em] text-white transition-all delay-150 duration-700 ease-out sm:text-6xl lg:text-[64px] lg:leading-[1.03]",
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
            >
              Motion Carved in Dark Steel.
            </h1>

            <p
              className={cn(
                "max-w-md text-sm leading-relaxed text-zinc-400 transition-all delay-300 duration-700 ease-out",
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
            >
              Drag or move across the three-dimensional escapement to inspect
              gear rotation, bezel geometry, and brushed metallic reflections.
            </p>

            <div
              className={cn(
                "flex flex-wrap items-center gap-4 pt-2 transition-all delay-500 duration-700 ease-out",
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
            >
              <Link
                href="/watches"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "group h-11 rounded-full bg-white px-7 font-mono text-xs font-bold tracking-[0.2em] text-black uppercase transition-transform duration-300 hover:scale-[1.02] hover:bg-zinc-200"
                )}
              >
                <span>Explore Timepieces</span>
                <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div
            style={{ transform: `translateY(${scrollShift * 0.25}px)` }}
            className={cn(
              "relative transition-all delay-200 duration-1000 ease-out lg:col-span-7",
              mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
            )}
          >
            <WatchScene3D />
            <p className="mt-2 text-center font-mono text-[10px] tracking-[0.24em] text-zinc-600 uppercase lg:text-right">
              DRAG OR HOVER TO ROTATE 3D ASSEMBLY
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}