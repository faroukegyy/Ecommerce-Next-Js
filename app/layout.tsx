import type { Metadata } from "next";
import "./globals.css";
import Footer from "./chared/Footer";
import Navbar from "./chared/Navbar";

export const metadata: Metadata = {
  title: "CHRONOS | Haute Horlogerie",
  description: "Precision timepieces in real-time 3D motion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="flex min-h-screen flex-col bg-[#050506] text-zinc-100 antialiased">
        <Navbar brandName="CHRONOS" />
        
        <main className="flex-1 pt-20">
          {children}
        </main>

        <Footer brandName="CHRONOS" />
      </body>
    </html>
  );
}