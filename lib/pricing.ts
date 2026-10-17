export type PlanSeed = {
  slug: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: string[];
  isPopular: boolean;
};

/**
 * Satu sumber untuk seed database dan fallback halaman publik.
 * Harga dalam Rupiah penuh (bukan sen).
 */
export const DEFAULT_PLANS: PlanSeed[] = [
  {
    slug: "free",
    name: "Free",
    description: "Untuk mencoba alur auth dan dashboard.",
    price: 0,
    interval: "month",
    features: ["1 pengguna", "BetterAuth (email + Google)", "Dashboard dasar"],
    isPopular: false,
  },
  {
    slug: "pro",
    name: "Pro",
    description: "Untuk SaaS yang mulai berjalan.",
    price: 149_000,
    interval: "month",
    features: [
      "10 pengguna",
      "Role & branch",
      "WhatsApp gateway",
      "RabbitMQ queue",
    ],
    isPopular: true,
  },
  {
    slug: "business",
    name: "Business",
    description: "Untuk tim dengan kebutuhan operasional penuh.",
    price: 499_000,
    interval: "month",
    features: [
      "Pengguna tanpa batas",
      "Semua fitur Pro",
      "Bulk WhatsApp worker",
      "Prioritas dukungan",
    ],
    isPopular: false,
  },
];

export function formatPrice(price: number): string {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
