import Link from "next/link";
import { Button } from "@/components/ui/button";

/* Tiga kalimat yang menutup halaman — bukan klaim, melainkan cara pembelian
   yang benar-benar ditawarkan. */
const CLOSERS = [
  "Mulai dari website + PPDB, atau presensi + WhatsApp",
  "Upgrade ke SIAKAD tanpa migrasi",
  "Hosting & dukungan berkala, add-on berbayar",
];

export function CtaSection() {
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[46ch]">
          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Mulai dari satu modul hari ini.
          </h2>
          <p className="text-navy-muted mt-4 text-base leading-relaxed">
            Konsultasikan kebutuhan sekolah Anda — pilih modulnya, lihat
            penawarannya, dan sekolah berjalan dengan satu catatan, bukan lima
            spreadsheet.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/landing/register/foundation">Daftar yayasan</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-border text-navy-foreground hover:bg-navy-foreground/10 w-full bg-transparent sm:w-auto"
            >
              <Link href="#paket">Lihat paket &amp; harga</Link>
            </Button>
          </div>
        </div>

        <ul className="border-navy-border mt-14 grid gap-y-4 border-t pt-8 sm:grid-cols-3">
          {CLOSERS.map((closer) => (
            <li
              key={closer}
              className="border-navy-border text-navy-foreground flex items-start gap-3 text-sm sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <span
                aria-hidden
                className="bg-navy-accent mt-1.5 size-1.5 shrink-0 rounded-full"
              />
              {closer}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
