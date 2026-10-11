import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Proof } from "./Proof";
import { Jenjang } from "./Jenjang";
import { Modules } from "./Modules";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { FinanceSection } from "./FinanceSection";
import { Reports } from "./Reports";
import { VaultBand } from "./VaultBand";
import { Faq } from "./Faq";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";

/**
 * One page, read top to bottom, alternating white canvas and tinted band so the
 * eye can tell sections apart without a card around each one.
 *
 *   masthead + the working register      white
 *   who uses it                          white strip
 *   every jenjang, separate data         band
 *   the seven modules                    white
 *   what each role does                  band
 *   catat, validasi, kirim               white
 *   the money behind it                  band
 *   what the yayasan can see             white
 *   where the data lives                 navy
 *   the questions                        white
 *   closing                              navy
 *
 * Server component on purpose — the interactive parts (navbar sheet, register,
 * jenjang tabs, FAQ accordion) declare their own `"use client"`.
 */
export function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-[100dvh] antialiased">
      <Navbar />

      <main>
        <Hero />
        <Proof />
        <Jenjang />
        <Modules />
        <Features />
        <HowItWorks />
        <FinanceSection />
        <Reports />
        <VaultBand />
        <Faq />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
