import { FileSpreadsheet } from "lucide-react";
import { Reveal } from "./Reveal";

/* Tumpukan nyata yang dipakai sekolah minggu ini — ditulis sebagai benda,
   bukan fitur, supaya pembacanya mengenali dirinya sendiri. */
const PILES = [
  "Nilai di satu file Excel per kelas, disatukan di akhir semester",
  "SPP di buku tulis, lalu direkap ulang ke Google Sheet",
  "Presensi di kertas, diketik lagi oleh TU tiap sore",
  "Pengumuman lewat tiga grup WhatsApp yang beda isinya",
  "Rapor dirangkai dua minggu menjelang pembagian",
];

/**
 * Bagian "rasa sakit": berapa banyak spreadsheet yang dipakai sekolah minggu
 * ini, dan apa yang terjadi kalau semuanya satu sistem. Tidak menjual fitur —
 * menjual akhir dari pekerjaan rangkap.
 */
export function Pain() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Berapa banyak spreadsheet yang dipakai sekolahmu minggu ini?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[52ch] text-base leading-relaxed">
              Setiap file tambahan adalah pekerjaan rangkap: menyalin, menyatukan,
              mengecek ulang. Sera menghapus pekerjaan rangkap itu — data dicatat
              sekali, dan sisanya tersusun sendiri.
            </p>

            <div className="border-border bg-secondary mt-8 rounded-3xl border p-6">
              <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                <FileSpreadsheet className="text-primary size-4" aria-hidden />
                Sebelum Sera
              </p>
              <ul className="mt-4 space-y-3">
                {PILES.map((item, i) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="bg-muted-foreground/30 text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-secondary-foreground text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={150}>
            <div className="bg-navy text-navy-foreground rounded-3xl p-8 sm:p-10">
              <p className="text-navy-accent text-xs font-semibold tracking-wide uppercase">
                Setelah Sera
              </p>
              <h3 className="mt-4 text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
                Satu catatan. Tersambung ke semua modul.
              </h3>
              <ul className="border-navy-border mt-8 divide-y">
                {[
                  [
                    "Presensi pagi",
                    "langsung masuk ke rekap dan notifikasi orang tua",
                  ],
                  [
                    "Nilai harian",
                    "langsung menjadi rapor, tanpa perakitan ulang",
                  ],
                  [
                    "SPP yang dibayar",
                    "langsung menutup tagihan dan memperbarui laporan kas",
                  ],
                  [
                    "Pengumuman sekolah",
                    "langsung sampai ke portal dan WhatsApp orang tua",
                  ],
                  [
                    "Laporan yayasan",
                    "tersusun dari data unit yang sama, kapan pun dibuka",
                  ],
                ].map(([head, tail]) => (
                  <li key={head} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="text-navy-foreground text-sm font-semibold sm:w-44 sm:shrink-0">
                      {head}
                    </span>
                    <span className="text-navy-muted text-sm leading-relaxed">
                      {tail}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-navy-muted border-navy-border mt-6 border-t pt-6 text-xs leading-relaxed">
                Data lama dari Excel diimpor sekaligus — siswa, guru, dan kelas
                tidak perlu diketik ulang.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
