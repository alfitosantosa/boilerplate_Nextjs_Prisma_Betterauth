import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Pain } from "./Pain";
import { Catalog } from "./Catalog";
import { DemoCharts } from "./DemoCharts";
import { Benefits } from "./Benefits";
import { Capabilities } from "./Capabilities";
import { Pricing } from "./Pricing";
import { Roadmap } from "./Roadmap";
import { HowItWorks } from "./HowItWorks";
import { Faq } from "./Faq";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { PageGradient } from "./PageGradient";

/**
 * Satu halaman jualan, dibaca dari atas ke bawah: masalah spreadsheet, katalog
 * produk, demo data, kemampuan sistem, harga, strategi mulai, cara kerja, lalu
 * tanya jawab. Scroll dimuluskan Lenis; bagian interaktif (navbar, register,
 * demo chart, FAQ) menyatakan `"use client"` sendiri.
 */
export function LandingPage() {
  return (
    <SmoothScroll>
      <div className="bg-background text-foreground relative isolate min-h-[100dvh] antialiased">
        <PageGradient />
        <Navbar />

        <main>
          <Hero />
          <Pain />
          <Catalog />
          <DemoCharts />
          <Benefits />
          <Capabilities />
          <Pricing />
          <Roadmap />
          <HowItWorks />
          <Faq />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default LandingPage;
