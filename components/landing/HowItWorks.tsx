import { Reveal } from "./Reveal";

/* Tiga langkah implementasi — dari konsultasi sampai sekolah berjalan. Impor
   Excel di langkah kedua adalah fitur nyata, bukan janji. */
const STEPS = [
  {
    no: "01",
    title: "Konsultasi & pilih paket",
    detail:
      "Kami dengar cara sekolah bekerja hari ini, lalu paket dan modul disesuaikan dengan kebutuhan dan anggaran — tidak dipaksa membeli semuanya.",
  },
  {
    no: "02",
    title: "Data lama dipindahkan",
    detail:
      "Siswa, guru, dan kelas diimpor sekaligus dari berkas Excel. Tidak ada pengetikan ulang, dan data langsung mengikuti struktur sekolah.",
  },
  {
    no: "03",
    title: "Pelatihan & sekolah berjalan",
    detail:
      "Guru, TU, dan bendahara dilatih per perannya. Sekolah mulai memakai sistem, dan dukungan berjalan berkala bersama hosting.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-[62ch]">
            <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Dari Excel ke sistem dalam tiga langkah.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[62ch] text-base leading-relaxed">
              Implementasi tidak harus proyek berbulan-bulan. Tiga langkah, dan
              sekolah berjalan dengan catatan yang sama.
            </p>
          </div>
        </Reveal>

        <div className="border-border mt-12 grid border-t md:grid-cols-3 md:gap-x-10">
          {STEPS.map((step, i) => (
            <Reveal key={step.no} delay={i * 100}>
              <div className="border-border py-7 md:border-t-0 md:border-l md:py-0 md:first:border-l-0 md:first:pl-0 md:pl-6">
                <span className="text-primary font-mono text-sm font-semibold tabular-nums">
                  {step.no}
                </span>
                <h3 className="text-foreground mt-3 text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-[42ch] text-sm leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
