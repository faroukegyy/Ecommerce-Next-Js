"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, ShieldCheck, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  thumbnail: string;
  images?: string[];
}

export default function TimepieceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [watch, setWatch] = useState<WatchDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    let active = true;
    setLoading(true);
    setError(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Timepiece not found");
        }
        return res.json();
      })
      .then((data: WatchDetail) => {
        if (!active) return;
        setWatch(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
      })
      .catch(() => {
        if (!active) return;
        setError("Could not load timepiece details from the API.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToBag = () => {
    if (!watch) return;
    setAddedCount((c) => c + 1);
    window.dispatchEvent(
      new CustomEvent("chronos:add-to-cart", {
        detail: {
          id: watch.id,
          title: watch.title,
          price: watch.price,
          image: selectedImage || watch.thumbnail,
        },
      })
    );
  };

  const gallery = watch?.images?.length
    ? watch.images
    : watch?.thumbnail
      ? [watch.thumbnail]
      : [];

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#050506] px-5 pt-28 pb-20 text-zinc-100 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/timepieces"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-zinc-400 uppercase transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Timepieces</span>
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="aspect-[4/3] animate-pulse border border-white/[0.06] bg-[#09090b] lg:col-span-7" />
            <div className="h-96 animate-pulse border border-white/[0.06] bg-[#09090b] p-8 lg:col-span-5" />
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-500/20 bg-red-950/20 p-8 font-mono text-xs text-red-300">
            <p>{error}</p>
            <Link
              href="/timepieces"
              className="mt-4 inline-block underline hover:text-white"
            >
              Return to catalog
            </Link>
          </div>
        )}

        {!loading && watch && (
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Left: Studio Display & Gallery */}
            <div className="space-y-4 lg:col-span-7">
              <div className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-white/[0.08] bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.13)_0%,rgba(24,24,27,0.45)_54%,#070709_100%)] p-8">
                <div className="pointer-events-none absolute inset-4 border border-white/[0.05]" />

                <div className="pointer-events-none absolute top-5 right-5 left-5 z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-zinc-400 uppercase">
                  <span className="bg-black/50 px-2.5 py-1 backdrop-blur-sm">
                    {watch.brand ?? "CHRONOS ARCHIVE"}
                  </span>
                  {typeof watch.rating === "number" && (
                    <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 text-zinc-300 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-zinc-300 text-zinc-300" />
                      {watch.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <img
                  src={selectedImage || watch.thumbnail}
                  alt={watch.title}
                  className="relative z-10 max-h-full max-w-[82%] object-contain contrast-[1.06] saturate-[1.05] drop-shadow-[0_24px_30px_rgba(0,0,0,0.92)] transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              {gallery.length > 1 && (
                <div className="flex flex-wrap items-center gap-3">
                  {gallery.map((imgUrl, index) => {
                    const isSelected = (selectedImage || watch.thumbnail) === imgUrl;
                    return (
                      <button
                        key={`${imgUrl}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={cn(
                          "relative flex h-20 w-24 items-center justify-center overflow-hidden border bg-[#09090b] p-2 transition-all",
                          isSelected
                            ? "border-white bg-[#111115]"
                            : "border-white/[0.08] opacity-65 hover:border-white/25 hover:opacity-100"
                        )}
                      >
                        <img
                          src={imgUrl}
                          alt={`${watch.title} view ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-6 border border-white/[0.08] bg-[#08080a] p-6 sm:p-8 lg:col-span-5">
              <div className="space-y-2 border-b border-white/[0.07] pb-6">
                <p className="font-mono text-[10px] tracking-[0.26em] text-zinc-500 uppercase">
                  {watch.category.replace("-", " ")}
                  {watch.sku ? ` • SKU ${watch.sku}` : ""}
                </p>

                <h1 className="text-2xl font-light tracking-[-0.02em] text-white sm:text-4xl">
                  {watch.title}
                </h1>

                <div className="pt-3 font-mono text-2xl font-semibold text-white">
                  ${watch.price.toLocaleString()}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-zinc-400">
                {watch.description}
              </p>

              <div className="space-y-3 border-y border-white/[0.07] py-5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.18em] text-zinc-500 uppercase">
                    BRAND
                  </span>
                  <span className="text-zinc-200">{watch.brand ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.18em] text-zinc-500 uppercase">
                    AVAILABILITY
                  </span>
                  <span className="text-zinc-200">
                    {typeof watch.stock === "number"
                      ? `${watch.stock} IN STOCK`
                      : "AVAILABLE"}
                  </span>
                </div>
                {watch.warrantyInformation && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="tracking-[0.18em] text-zinc-500 uppercase">
                      WARRANTY
                    </span>
                    <span className="text-right text-zinc-200">
                      {watch.warrantyInformation}
                    </span>
                  </div>
                )}
                {watch.shippingInformation && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="tracking-[0.18em] text-zinc-500 uppercase">
                      DELIVERY
                    </span>
                    <span className="text-right text-zinc-200">
                      {watch.shippingInformation}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-12 w-full rounded-full bg-white font-mono text-xs font-bold tracking-[0.2em] text-black uppercase hover:bg-zinc-200"
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add to Bag</span>
                </button>

                {addedCount > 0 && (
                  <p className="text-center font-mono text-[11px] tracking-[0.18em] text-zinc-300 uppercase">
                    ADDED TO BAG ({addedCount})
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 pt-2 font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                  <span>AUTHENTICATED REFERENCE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}