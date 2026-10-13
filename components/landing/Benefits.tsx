import {
  CalendarClock,
  FileCheck2,
  Layers,
  ScrollText,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Reveal } from "./Reveal";

/* Strip integrasi: alat yang benar-benar sudah dipakai platform, bukan logo
   dekoratif. */
const INTEGRATIONS = ["Midtrans", "WhatsApp", "Excel", "PDF"];

/* Delapan benefit, 4+4, mengikuti referensi: kolom kiri operasional kas,
   kolom kanan pengalaman pembayaran. */
const BENEFITS = [
  {
    icon: Layers,
    title: "Semua metode pembayaran dalam satu gateway",
    detail:
      "Transfer bank, e-wallet, dan kartu lewat Midtrans Snap & Core API.",
  },
  {
    icon: ShieldCheck,
    title: "Dana per cabang tidak bercampur",
    detail: "Rekening kas tercatat per cabang sekolah.",
  },
  {
    icon: Zap,
    title: "Status tagihan terbarui seketika",
    detail: "Pembayaran berhasil langsung menutup tagihan siswa.",
  },
  {
    icon: ScrollText,
    title: "Jejak audit tiap transaksi",
    detail: "Referensi, tanggal, dan status tercatat untuk pemeriksaan.",
  },
  {
    icon: CalendarClock,
    title: "Tagihan otomatis per siswa per bulan",
    detail: "SPP, uang pangkal, dan biaya kegiatan dibuat oleh sistem.",
  },
  {
    icon: FileCheck2,
    title: "Kuitansi PDF bernomor",
    detail: "Diterbitkan dari sistem, siap arsip dan laporan.",
  },
  {
    icon: TrendingUp,
    title: "Tunggakan terlihat dalam satu layar",
    detail: "Bendahara tahu siapa yang belum bayar sebelum menagih.",
  },
  {
    icon: Smartphone,
    title: "Orang tua membayar dari ponsel",
    detail: "Lewat browser biasa, tanpa memasang aplikasi.",
  },
];

export function Benefits() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-[58ch]">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Modul keuangan
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Kumpulkan pembayaran sekolah lebih cepat, tanpa rekap manual.
            </h2>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground text-sm">
                Terhubung dengan yang sudah dipakai sekolah:
              </span>
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={(i % 2) * 80}>
                <div className="border-border flex items-start gap-4 border-t pt-6">
                  <span className="bg-interactive-surface text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-foreground text-base font-semibold tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 max-w-[46ch] text-sm leading-relaxed">
                      {benefit.detail}
                    </p>
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
