import Link from "next/link";
import {
  Baby,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Megaphone,
  MonitorCheck,
  Network,
  ShieldAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { capabilities } from "@/lib/marketing/products";
import { Reveal } from "./Reveal";

/* Chip paket di strip — tautan ke seksi harga, bukan dekorasi. */
const PACKAGE_CHIPS = [
  { label: "Starter", href: "#paket" },
  { label: "Professional", href: "#paket" },
  { label: "Complete", href: "#paket" },
  { label: "Yayasan", href: "#paket" },
];

const AREA_ICONS: Record<string, LucideIcon> = {
  "Akademik & Rapor": BookOpen,
  "Presensi & Kehadiran": CalendarCheck,
  "Keuangan & SPP": Wallet,
  "Komunikasi Sekolah": Megaphone,
  "Tahfidz Al-Qur'an": BookMarked,
  "Ujian & Tugas": MonitorCheck,
  "Kedisiplinan Siswa": ShieldAlert,
  "Perkembangan Anak": Baby,
  "Yayasan & Hak Akses": Network,
};

/**
 * Fitur & produk dalam pola referensi: eyebrow + headline + strip chip +
 * dua kolom item (ikon + judul + detail). Kemampuan ditulis sebagai fungsi
 * yang dikerjakan sistem — bukan nama tabel.
 */
export function Capabilities() {
  return (
    <section id="fitur" className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-[58ch]">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Fitur &amp; produk
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Yang dikerjakan sistem, bukan yang Anda ketik ulang.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[62ch] text-base leading-relaxed">
              Sembilan area kerja sekolah yang sudah berjalan di satu platform.
              Tiap area berdiri sendiri, tapi memakai catatan yang sama.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground text-sm">
                Tersedia di semua paket:
              </span>
              {PACKAGE_CHIPS.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-ring/80 inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {capabilities.map((area, i) => {
            const Icon = AREA_ICONS[area.title] ?? BookOpen;
            return (
              <Reveal key={area.title} delay={(i % 2) * 80}>
                <div className="border-border flex items-start gap-4 border-t pt-6">
                  <span className="bg-interactive-surface text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-foreground text-base font-semibold tracking-tight">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 max-w-[46ch] text-sm leading-relaxed">
                      {area.intro}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {area.points.map((point) => (
                        <li
                          key={point}
                          className="text-secondary-foreground flex items-start gap-2 text-sm leading-relaxed"
                        >
                          <span
                            aria-hidden
                            className="bg-primary/70 mt-2 size-1 shrink-0 rounded-full"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
