import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The closing band. One headline, one action, and then the three facts that
 * survive every conversation with a yayasan — kept because they are counts the
 * repository can prove, not because the band needed decoration.
 */
const PROOFS = [
  "51 tabel data terintegrasi",
  "Multi-cabang dalam satu yayasan",
  "Presensi dan SPP dalam satu sistem",
];

export function CtaSection() {
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[46ch]">
          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Mulai dari satu unit. Tambah cabang kapan saja.
          </h2>
          <p className="text-navy-muted mt-4 text-base leading-relaxed">
            Daftarkan yayasan, pindahkan data lama dari Excel, lalu jalankan
            presensi dan SPP di unit pertama sebelum membuka unit berikutnya.
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
              <Link href="/auth/sign-in">Masuk ke akun</Link>
            </Button>
          </div>
        </div>

        <ul className="border-navy-border mt-14 grid gap-y-4 border-t pt-8 sm:grid-cols-3">
          {PROOFS.map((proof) => (
            <li
              key={proof}
              className="border-navy-border text-navy-foreground flex items-start gap-3 text-sm sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <span
                aria-hidden
                className="bg-navy-accent mt-1.5 size-1.5 shrink-0 rounded-full"
              />
              {proof}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
