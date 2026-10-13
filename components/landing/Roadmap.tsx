import { roadmap } from "@/lib/marketing/products";
import { Reveal } from "./Reveal";

/**
 * Strategi jualan jadi struktur halaman: urutan lima langkah yang disarankan
 * untuk sekolah — mulai dari yang manfaatnya paling mudah dijelaskan.
 */
export function Roadmap() {
  return (
    <section id="mulai" className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-[62ch]">
            <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Tidak harus mulai dari sistem yang besar.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[62ch] text-base leading-relaxed">
              Urutan yang kami sarankan ke sekolah — dimulai dari manfaat yang
              paling cepat terlihat, bukan dari modul yang paling berat.
            </p>
          </div>
        </Reveal>

        <ol className="border-border mt-12 border-t">
          {roadmap.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 60}>
                <div className="border-border grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-b py-6 md:grid-cols-[4rem_1fr_22rem] md:items-baseline md:py-7">
                  <span className="text-primary font-mono text-sm font-semibold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-foreground text-base font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground col-start-2 text-sm leading-relaxed md:col-start-3 md:row-start-1">
                    {step.detail}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="text-muted-foreground mt-8 max-w-[68ch] text-sm leading-relaxed">
            Setiap modul juga bisa dibeli sebagai proyek tersendiri. Sekolah yang
            belum siap SIAKAD lengkap bisa mulai dari website dan PPDB, lalu
            melakukan upgrade tanpa migrasi ke aplikasi lain.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
