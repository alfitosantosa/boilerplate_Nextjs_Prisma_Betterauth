import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MeshGradient } from "./MeshGradient";
import { RegisterDemo } from "./RegisterDemo";

/* The four facts on the strip are counts, not claims: 51 Prisma models, three
   school levels under one foundation, five roles, four attendance statuses. */
const FACTS = [
  "51 tabel data terintegrasi",
  "3 jenjang dalam satu yayasan",
  "5 peran pengguna",
  "4 status presensi",
];

/**
 * The masthead. Left-aligned over the gradient field, with the working register
 * beside it — the product's own sheet, not an illustration of one.
 *
 * This is the only place on the landing page that animates on load; the rest of
 * the page holds still and lets the reader scroll.
 */
export function Hero() {
  return (
    <section className="border-border relative overflow-hidden border-b">
      <MeshGradient />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-24">
        <div className="min-w-0 lg:col-span-5">
          <h1 className="animate-element animate-delay-100 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.03] font-bold tracking-[-0.035em] text-balance">
            Seluruh administrasi sekolah, dalam satu catatan.
          </h1>

          <p className="text-muted-foreground animate-element animate-delay-200 mt-5 max-w-[52ch] text-lg leading-relaxed text-pretty">
            Presensi, rapor, tahfidz, dan SPP setiap cabang tercatat di satu
            sistem. Guru tidak menulis ulang, bendahara tidak merekap manual,
            dan yayasan bisa membaca laporan tiap unit kapan saja.
          </p>

          <div className="animate-element animate-delay-300 mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/landing/register/foundation">Daftar yayasan</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#cara-kerja">Lihat cara kerjanya</Link>
            </Button>
          </div>

          <ul className="text-muted-foreground animate-element animate-delay-400 mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            {FACTS.map((fact, i) => (
              <li key={fact} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                ) : null}
                <span className="tabular-nums">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-element animate-delay-500 min-w-0 lg:col-span-7">
          <RegisterDemo />
        </div>
      </div>
    </section>
  );
}
