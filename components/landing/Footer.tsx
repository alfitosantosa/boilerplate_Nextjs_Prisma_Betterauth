import Link from "next/link";
import { SeraLogo } from "@/components/SeraLogo";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/marketing/products";

const LINK_COLUMNS = [
  {
    title: "Produk",
    links: products.slice(0, 5).map((p) => ({
      label: p.name,
      href: `/produk/${p.slug}`,
    })),
  },
  {
    title: "Produk lainnya",
    links: products.slice(5).map((p) => ({
      label: p.name,
      href: `/produk/${p.slug}`,
    })),
  },
  {
    title: "Mulai",
    links: [
      { label: "Paket & harga", href: "#paket" },
      { label: "Demo data", href: "#demo" },
      { label: "Cara kerja", href: "#cara-kerja" },
      { label: "Pertanyaan", href: "#faq" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-secondary/50 border-t px-6 pt-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-12 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="focus-visible:ring-ring/80 inline-block rounded-xl focus-visible:ring-[3px] focus-visible:outline-none"
              aria-label="Sera App — beranda"
            >
              <SeraLogo markClassName="h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-[30ch] text-sm leading-relaxed">
              Satu sistem, nol spreadsheet. Platform sekolah digital oleh
              SantosaTechID.
            </p>
          </div>

          {LINK_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-foreground text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/80 rounded-lg text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="bg-border" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 pt-6 text-xs sm:flex-row">
          <p>
            © {currentYear} Sera · SantosaTechID. Seluruh data sekolah di
            Indonesia.
          </p>
          <p className="tabular-nums">Dibuat untuk sekolah, bukan untuk vendor.</p>
        </div>
      </div>
    </footer>
  );
}
