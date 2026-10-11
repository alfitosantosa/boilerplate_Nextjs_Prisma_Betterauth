import { Database, Import, Lock, Users } from "lucide-react";

/**
 * The one dark band on the page — Stripe's technical band, doing the job the
 * research says the yayasan cares about most after price: where the data lives,
 * who can reach it, and what happens if a file goes missing.
 *
 * Four answers, each a fact about the running system rather than a promise.
 */
const GUARANTEES = [
  {
    icon: Database,
    title: "Satu basis data, bukan banyak berkas",
    body: "Data siswa, guru, keuangan, dan inventaris duduk di satu basis data yang sama. Tidak ada rekap yang perlu disalin dari berkas terpisah karena seluruh modul membaca sumber yang sama.",
  },
  {
    icon: Lock,
    title: "Terpisah per yayasan dan per cabang",
    body: "Yayasan terdaftar sebagai Foundation, tiap unit sebagai Branch dengan branchId sendiri. Pengguna terikat pada satu cabang, sehingga guru, bendahara, dan orang tua hanya bekerja di data cabangnya.",
  },
  {
    icon: Users,
    title: "Lima peran, lima tampilan",
    body: "Admin, bendahara, guru, siswa, dan orang tua masuk lewat akun yang sama tetapi melihat layar yang berbeda. Hak akses mengikuti peran dan cabang, bukan dibagi lewat kata sandi bersama.",
  },
  {
    icon: Import,
    title: "Data lama ikut pindah",
    body: "Data master seperti siswa, guru, dan kelas diimpor massal dari berkas Excel yang sudah dipakai sekolah, lalu mengikuti struktur yayasan dan cabang yang sudah terdaftar.",
  },
];

export function VaultBand() {
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Data sekolah Anda, di satu tempat dan hanya milik Anda.
          </h2>
          <p className="text-navy-muted mt-4 text-base leading-relaxed">
            Administrasi manual runtuh bukan karena kurang rajin, tetapi karena
            datanya tersebar. Empat hal yang dijaga sistem ini adalah alasan
            paling sering dipakai yayasan untuk pindah.
          </p>
        </div>

        <ul className="border-navy-border mt-14 grid gap-px border-t sm:grid-cols-2">
          {GUARANTEES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="border-navy-border border-b px-0 py-8 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
              >
                <Icon className="text-navy-accent size-5" aria-hidden />
                <h3 className="text-navy-foreground mt-4 text-base font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-navy-muted mt-2 max-w-[54ch] text-sm leading-relaxed">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
