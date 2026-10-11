import { SeraLogo } from "@/components/SeraLogo";

/**
 * The proof strip. Stripe opens this slot with a logo wall because it has
 * thousands of customers; this platform has one real deployment, so the strip
 * names it and then states counts that are verifiable in the repository rather
 * than implying a customer base that does not exist yet.
 *
 * A marked structure (hairline dividers), not four identical cards.
 */
const COUNTS = [
  { value: "51", label: "tabel data terintegrasi" },
  { value: "3", label: "jenjang: SMP, SMA, SMK IT" },
  { value: "5", label: "peran pengguna" },
  { value: "4", label: "status presensi" },
];

export function Proof() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-[46ch]">
            <p className="text-muted-foreground text-xs font-medium">
              Sedang dipakai oleh
            </p>
            <div className="mt-3">
              <SeraLogo
                markClassName="h-9 w-auto"
                subtitle="Yayasan Pendidikan Rahmaniyah Al-Islamy"
              />
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Satu yayasan, tiga unit sekolah — SMP, SMA, dan SMK IT — dengan
              data tiap unit yang berdiri sendiri.
            </p>
          </div>

          <dl className="border-border grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0 lg:border-l lg:pl-12">
            {COUNTS.map((count) => (
              <div
                key={count.label}
                className="border-border px-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0 lg:pl-6"
              >
                <dd className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
                  {count.value}
                </dd>
                <dt className="text-muted-foreground mt-1 max-w-[18ch] text-xs leading-snug">
                  {count.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
