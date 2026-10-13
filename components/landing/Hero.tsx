import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MeshGradient } from "./MeshGradient";
import { RegisterDemo } from "./RegisterDemo";

/* Empat fakta di strip adalah angka yang bisa diverifikasi: 10 modul dalam
   katalog, 4 paket harga, 9 area kerja, 3 jenjang (SMP, SMA, SMK IT). */
const FACTS = [
  "10 modul siap pakai",
  "4 paket sesuai anggaran",
  "9 area kerja terintegrasi",
  "6 jenjang: TK, SD, SMP, SMA, Kuliah",
];

/**
 * Masthead gaya referensi SaaS: teks di tengah (eyebrow, headline, subcopy,
 * CTA, strip fakta), lalu produk asli — register presensi yang berfungsi —
 * membentang di bawahnya sebagai bukti, bukan ilustrasi.
 */
export function Hero() {
  return (
    <section className="border-border relative overflow-hidden border-b">
      <MeshGradient />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-20 lg:pt-24">
        <div className="mx-auto flex max-w-[64ch] flex-col items-center text-center">
          <p className="animate-element animate-delay-100 bg-primary/10 text-primary inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold tracking-wide">
            Platform sekolah digital
          </p>

          <h1 className="animate-element animate-delay-200 mt-6 text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">
            Hapus spreadsheet dari administrasi sekolahmu.
          </h1>

          <p className="text-muted-foreground animate-element animate-delay-300 mt-5 max-w-[58ch] text-lg leading-relaxed text-pretty">
            Sera mencatat presensi, nilai, SPP, dan rapor dalam satu sistem.
            Kepala sekolah membaca laporan hari ini, bendahara tidak merekap
            manual, dan orang tua tahu kabar anak lewat WhatsApp.
          </p>

          <div className="animate-element animate-delay-400 mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#paket">Lihat paket &amp; harga</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="#demo">Jadwalkan demo</Link>
            </Button>
          </div>

          <ul className="text-muted-foreground animate-element animate-delay-500 mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
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

        <div className="animate-element animate-delay-600 mx-auto mt-14 max-w-4xl lg:mt-16">
          <RegisterDemo />
        </div>
      </div>
    </section>
  );
}
