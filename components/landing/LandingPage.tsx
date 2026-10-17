import pkg from "@/package.json";
import { prisma } from "@/services/prisma";
import {
  DEFAULT_PLANS,
  formatPrice,
  type PlanSeed,
} from "@/lib/pricing";
import {
  ArrowRight,
  Check,
  Database,
  KeyRound,
  MessageSquare,
  Package,
  Rabbit,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import Link from "next/link";

const REQUIRED_ENV = [
  ["DATABASE_URL", "PostgreSQL connection string"],
  ["BETTER_AUTH_SECRET", "Random secret untuk BetterAuth"],
  ["BETTER_AUTH_URL", "Base URL aplikasi, mis. http://localhost:3000"],
  ["GOOGLE_CLIENT_ID", "OAuth Google"],
  ["GOOGLE_CLIENT_SECRET", "OAuth Google"],
  ["NEXT_PUBLIC_CLIENT_NAME", "Nama produk di metadata"],
  ["NEXT_PUBLIC_EVO_URL", "Base URL Evolution API (WhatsApp)"],
  ["NEXT_PUBLIC_EVO_APIKEY", "API key Evolution API"],
  ["NEXT_PUBLIC_EVO_INSTANCE", "Nama instance Evolution API"],
  ["RABBITMQ_URL", "amqp://user:pass@host:5672"],
] as const;

const OPTIONAL_ENV = [
  ["NEXT_PUBLIC_CLIENT_ID", "ID klien"],
  ["NEXT_PUBLIC_CLIENT_IMAGE_URL", "Logo klien"],
  ["CLIENT_FAVICON", "Favicon"],
  ["CLIENT_APPLE_ICON", "Apple touch icon"],
  ["NEXT_PUBLIC_FILESERVER_URL", "File server"],
  ["PORT", "Port server"],
  ["BYPASS_IMAGE_OPTIMIZATION", "true untuk melewati optimasi gambar"],
  ["NEXT_PUBLIC_MIDTRANS_CLIENT_KEY", "Midtrans (opsional)"],
  ["NEXT_PUBLIC_MIDTRANS_SERVER_KEY", "Midtrans (opsional)"],
  ["NEXT_PUBLIC_MIDTRANS_MERCHANT_ID", "Midtrans (opsional)"],
  ["NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION", "Midtrans (opsional)"],
  ["NEXT_PUBLIC_MIDTRANS_URL", "Midtrans (opsional)"],
] as const;

const CORE_DEPS = [
  "next",
  "react",
  "react-dom",
  "better-auth",
  "@prisma/client",
  "@prisma/adapter-pg",
  "amqplib",
  "zod",
  "@tanstack/react-query",
  "tailwindcss",
  "typescript",
  "prisma",
] as const;

const STACK = [
  {
    icon: ShieldCheck,
    title: "BetterAuth",
    body: "Email/password, Google OAuth, sesi, admin plugin.",
  },
  {
    icon: Database,
    title: "Prisma + PostgreSQL",
    body: "User, role, branch, user data, plan, dan membership.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Gateway",
    body: "Kirim pesan langsung atau lewat antrean massal.",
  },
  {
    icon: Rabbit,
    title: "RabbitMQ",
    body: "Queue, retry bertingkat, dan dead-letter queue.",
  },
] as const;

async function getPlans(): Promise<PlanSeed[]> {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
      select: {
        slug: true,
        name: true,
        description: true,
        price: true,
        interval: true,
        features: true,
        isPopular: true,
      },
    });
    return plans.length > 0 ? plans : DEFAULT_PLANS;
  } catch {
    return DEFAULT_PLANS;
  }
}

export default async function LandingPage() {
  const plans = await getPlans();
  const versions = {
    ...Object.fromEntries(
      Object.entries(pkg.dependencies).map(([k, v]) => [k, v]),
    ),
    ...Object.fromEntries(
      Object.entries(pkg.devDependencies).map(([k, v]) => [k, v]),
    ),
  } as Record<string, string>;
  const productName = process.env.NEXT_PUBLIC_CLIENT_NAME || "SaaS Starter";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            {productName}
          </span>
          <nav className="flex items-center gap-3 text-sm">
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#stack"
              className="text-muted-foreground hover:text-foreground"
            >
              Stack
            </a>
            <a
              href="#setup"
              className="text-muted-foreground hover:text-foreground"
            >
              Setup
            </a>
            <Link
              href="/auth/signIn"
              className="border-border hover:bg-secondary rounded-md border px-3 py-1.5 font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signUp"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 font-medium"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="border-border text-muted-foreground mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <Package className="h-3.5 w-3.5" /> Boilerplate siap pakai
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Mulai SaaS tanpa membangun ulang fondasinya
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg">
            Next.js, Prisma, BetterAuth, WhatsApp gateway, dan RabbitMQ sudah
            tersambung. Ganti nama produk, isi environment, lalu fokus ke fitur
            bisnis.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/signUp"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-semibold"
            >
              Mulai sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#pricing"
              className="border-border hover:bg-secondary inline-flex items-center gap-2 rounded-md border px-5 py-2.5 font-semibold"
            >
              Lihat harga
            </a>
          </div>
        </section>

        <section id="stack" className="border-border border-y">
          <div className="mx-auto grid max-w-6xl gap-4 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {STACK.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border-border bg-card rounded-xl border p-5"
              >
                <Icon className="text-primary mb-3 h-5 w-5" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
            <p className="text-muted-foreground mt-2">
              Tersimpan di tabel{" "}
              <code className="font-mono text-xs">plans</code> dan bisa diubah
              lewat database.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.slug}
                className={`bg-card relative rounded-2xl border p-6 ${
                  plan.isPopular ? "border-primary" : "border-border"
                }`}
              >
                {plan.isPopular && (
                  <span className="bg-primary text-primary-foreground absolute -top-3 right-5 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                    Populer
                  </span>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 min-h-10 text-sm">
                  {plan.description}
                </p>
                <p className="mt-4 text-3xl font-extrabold">
                  {formatPrice(plan.price)}
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm font-normal">
                      {" "}
                      / {plan.interval}
                    </span>
                  )}
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 h-4 w-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signUp"
                  className={`mt-6 block rounded-md py-2 text-center text-sm font-semibold ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border hover:bg-secondary border"
                  }`}
                >
                  Pilih {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="setup" className="border-border border-t">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <KeyRound className="h-5 w-5" /> Environment wajib
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Salin ke <code className="font-mono">.env</code>. Jangan commit
                nilai aslinya.
              </p>
              <ul className="mt-5 space-y-2">
                {REQUIRED_ENV.map(([key, note]) => (
                  <li key={key} className="border-border rounded-lg border p-3">
                    <code className="text-sm font-semibold">{key}</code>
                    <span className="text-muted-foreground block text-xs">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
              <details className="mt-4">
                <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
                  Environment opsional ({OPTIONAL_ENV.length})
                </summary>
                <ul className="mt-2 space-y-1.5">
                  {OPTIONAL_ENV.map(([key, note]) => (
                    <li key={key} className="text-sm">
                      <code className="font-mono text-xs">{key}</code>{" "}
                      <span className="text-muted-foreground">— {note}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Terminal className="h-5 w-5" /> Versi dependency
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Diambil langsung dari{" "}
                <code className="font-mono">package.json</code>.
              </p>
              <div className="border-border mt-5 overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <tbody>
                    {CORE_DEPS.map((name) => (
                      <tr
                        key={name}
                        className="border-border border-b last:border-0"
                      >
                        <td className="px-3 py-2 font-mono text-xs">{name}</td>
                        <td className="text-muted-foreground px-3 py-2 text-right font-mono text-xs">
                          {versions[name] ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <details className="mt-4">
                <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
                  Semua dependency ({Object.keys(versions).length})
                </summary>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {Object.entries(versions)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([name, version]) => (
                      <p key={name} className="truncate text-xs">
                        <span className="font-mono">{name}</span>{" "}
                        <span className="text-muted-foreground">{version}</span>
                      </p>
                    ))}
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border text-muted-foreground border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm">
          <span>
            {productName} · {pkg.name} v{pkg.version}
          </span>
          <span>Next.js · Prisma · BetterAuth · WhatsApp · RabbitMQ</span>
        </div>
      </footer>
    </div>
  );
}
