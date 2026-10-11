import Link from "next/link";
import { SeraLogo } from "@/components/SeraLogo";
import { Separator } from "@/components/ui/separator";

const LINK_COLUMNS = [
  {
    title: "Modul",
    links: [
      { label: "Akademik & jadwal", href: "#fitur" },
      { label: "Presensi & disiplin", href: "#fitur" },
      { label: "Tahfidz Al-Qur'an", href: "#fitur" },
      { label: "Penilaian & rapor", href: "#fitur" },
      { label: "Bot WhatsApp orang tua", href: "#fitur" },
    ],
  },
  {
    title: "Keuangan",
    links: [
      { label: "SPP online (Midtrans)", href: "#keuangan" },
      { label: "Tagihan bulanan & lainnya", href: "#keuangan" },
      { label: "Kas per cabang", href: "#keuangan" },
      { label: "Kuitansi PDF", href: "#keuangan" },
    ],
  },
  {
    title: "Sekolah & data",
    links: [
      { label: "Jenjang sekolah", href: "#jenjang" },
      { label: "Cara kerja sistemnya", href: "#cara-kerja" },
      { label: "Isolasi data tiap cabang", href: "#faq" },
      { label: "Peran & hak akses", href: "#faq" },
      { label: "Impor data lama dari Excel", href: "#faq" },
      { label: "Halaman untuk orang tua", href: "/landing/welcome" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-secondary border-t px-6 pt-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-12 sm:grid-cols-5">
          {/* The masthead, closed the way it opened. */}
          <div className="col-span-2 space-y-4">
            <Link
              href="/"
              className="focus-visible:ring-ring/80 inline-block rounded-xl focus-visible:ring-[3px] focus-visible:outline-none"
            >
              <SeraLogo
                markClassName="h-9 w-auto"
                subtitle="Sistem informasi sekolah"
              />
            </Link>

            <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
              Presensi, rapor, tahfidz, dan pembayaran SPP dalam satu catatan.
              Dikembangkan oleh PT Santosa Tech Indonesia.
            </p>

            <ul className="text-muted-foreground space-y-1.5 text-xs">
              <li>51 tabel data terintegrasi</li>
              <li>Isolasi data per yayasan dan cabang</li>
              <li>SMP, SMA, dan SMK IT dalam satu yayasan</li>
            </ul>
          </div>

          {LINK_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-foreground text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="text-muted-foreground mt-4 space-y-2.5 text-xs">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-interactive inline-block py-1 transition-colors hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="bg-border" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 pt-6 text-xs sm:flex-row">
          <span>
            &copy; {currentYear} PT Santosa Tech Indonesia. Seluruh hak cipta
            dilindungi.
          </span>
          <span>Dibuat khusus untuk yayasan &amp; sekolah modern.</span>
        </div>
      </div>
    </footer>
  );
}
