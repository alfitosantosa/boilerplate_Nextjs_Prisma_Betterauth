"use client";

import { useState } from "react";
import { BookOpen, Building2, GraduationCap } from "lucide-react";

/**
 * "Satu platform, setiap jenjang" — the answer to the scalability question a
 * yayasan asks first. The modules are the same at every level; what is separate
 * is the unit's own data, which is the part that actually varies between an SMP
 * and an SMK IT under one foundation.
 *
 * Only the three levels the platform actually serves are shown. Nothing here
 * claims a level we do not run.
 */
const LEVELS = [
  {
    id: "smp",
    name: "SMP",
    icon: BookOpen,
    lead: "Kelas VII–IX dengan mapel wajib, satu rekening kas unit, dan wali kelas yang memegang poin kedisiplinan.",
    items: [
      "Tahun ajaran dan kelas VII–IX berdiri sendiri",
      "Jadwal per guru per kelas, presensi per jadwal",
      "Rapor tersusun dari tipe nilai unit ini saja",
      "Tidak ada penjurusan; satu daftar mapel",
    ],
  },
  {
    id: "sma",
    name: "SMA",
    icon: GraduationCap,
    lead: "Kelas X–XII dengan penjurusan dan paket mapel pilihan, tetap di bawah yayasan yang sama.",
    items: [
      "Jurusan dan paket mapel dicatat sebagai data unit",
      "Rekening kas dan tagihan tidak bercampur dengan SMP",
      "Poin kedisiplinan dihitung per unit",
      "Pengguna hanya melihat data unitnya sendiri",
    ],
  },
  {
    id: "smk",
    name: "SMK IT",
    icon: Building2,
    lead: "Kelas X–XII dengan jurusan keahlian, penilaian praktik, dan kebutuhan administrasi yang paling banyak.",
    items: [
      "Program studi didaftarkan per unit, bukan global",
      "Setoran tahfidz tercatat berdampingan dengan nilai praktik",
      "Tagihan dan kuitansi bernomor per unit",
      "Laporan unit bisa dibandingkan dari sisi yayasan",
    ],
  },
];

export function Jenjang() {
  const [active, setActive] = useState(LEVELS[0].id);
  const level = LEVELS.find((l) => l.id === active) ?? LEVELS[0];

  return (
    <section id="jenjang" className="bg-secondary border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Modulnya sama di setiap jenjang. Datanya tidak bercampur.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Yayasan terdaftar sebagai satu Foundation. Setiap unit sekolah adalah
            Branch dengan datanya sendiri — kelas, jadwal, tagihan, dan
            penggunanya. Menambah unit baru tidak mengubah unit yang sudah
            berjalan.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Jenjang sekolah"
          className="border-border mt-10 inline-flex rounded-2xl border bg-card p-1"
        >
          {LEVELS.map((item) => {
            const on = item.id === active;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`jenjang-${item.id}`}
                id={`tab-${item.id}`}
                onClick={() => setActive(item.id)}
                className={`focus-visible:ring-ring/80 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none ${
                  on
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {item.name}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`jenjang-${level.id}`}
          aria-labelledby={`tab-${level.id}`}
          className="mt-6 grid gap-8 lg:grid-cols-12"
        >
          <p className="text-foreground max-w-[46ch] text-lg leading-relaxed text-pretty lg:col-span-5">
            {level.lead}
          </p>
          <ul className="border-border grid gap-0 divide-y border-t lg:col-span-7">
            {level.items.map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex items-start gap-3 py-3.5 text-sm leading-relaxed"
              >
                <span
                  aria-hidden
                  className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
