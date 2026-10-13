"use client";

import Link from "next/link";
import { Activity, Building2, CheckCircle2, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Reveal } from "./Reveal";

/**
 * Demo data semua chart modul keuangan — tampilan yang sama dengan dashboard
 * bendahara di /dashboard/admin/finance/billing/chart, dengan data ilustrasi
 * tiga cabang. Angka dibuat "kotor" (bukan 99,9%) supaya terasa nyata.
 */
const MONTHLY = [
  { month: "Agu", tunggakan: 42_500_000, terbayar: 78_300_000, volume: 214 },
  { month: "Sep", tunggakan: 38_200_000, terbayar: 81_100_000, volume: 196 },
  { month: "Okt", tunggakan: 45_900_000, terbayar: 76_400_000, volume: 231 },
  { month: "Nov", tunggakan: 31_600_000, terbayar: 84_200_000, volume: 174 },
  { month: "Des", tunggakan: 29_100_000, terbayar: 86_900_000, volume: 158 },
  { month: "Jan", tunggakan: 24_700_000, terbayar: 88_500_000, volume: 142 },
];

const BY_BRANCH = [
  { branch: "SMP IT Santosa", tunggakan: 41_200_000, jumlah: 143 },
  { branch: "SMA IT Santosa", tunggakan: 26_500_000, jumlah: 98 },
  { branch: "SMK IT Santosa", tunggakan: 18_600_000, jumlah: 76 },
];

const TUNGGAKAN_COLOR = "var(--destructive-solid)";
const TERBAYAR_COLOR = "var(--success-solid)";

/* Format rupiah deterministik: currency style Intl menghasilkan spasi setelah
   "Rp" yang beda antara ICU server dan browser (hydrasi gagal). Skala jt/M
   dihitung manual, "Rp" ditempel literal — hasil sama di kedua sisi. */
const fmt = (v: number) => {
  const abs = Math.abs(v);
  const scale = abs >= 1_000_000_000 ? 1_000_000_000 : abs >= 1_000_000 ? 1_000_000 : 1;
  const suffix = abs >= 1_000_000_000 ? " M" : abs >= 1_000_000 ? " jt" : "";
  const num = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(v / scale);
  return `Rp${num}${suffix}`;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/95 min-w-[180px] rounded-3xl border border-border p-3 shadow-xl backdrop-blur">
      <p className="text-muted-foreground mb-2 text-xs font-semibold">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
          </span>
          <span className="font-semibold tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="border-border bg-card rounded-3xl border p-5 sm:p-6">
      <figcaption className="text-foreground text-base font-semibold">
        {title}
      </figcaption>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{sub}</p>
      <div className="mt-5">{children}</div>
    </figure>
  );
}

/**
 * Seksi demo: semua chart dari modul keuangan, supaya calon pembeli melihat
 * bentuk laporan yang akan dilihatnya setiap hari — bukan ilustrasi abstrak.
 */
export function DemoCharts() {
  const kpis = [
    {
      title: "Total Tunggakan",
      value: fmt(86_300_000),
      sub: "312 item belum dibayar",
      icon: Wallet,
      color: "text-destructive",
    },
    {
      title: "Total Terbayar",
      value: fmt(495_400_000),
      sub: "1.284 transaksi lunas",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      title: "Collection Rate",
      value: "85,2%",
      sub: "Dari total tagihan",
      icon: Activity,
      color: "text-info",
    },
    {
      title: "Tunggakan Terbesar",
      value: "SMP IT Santosa",
      sub: fmt(41_200_000),
      icon: Building2,
      color: "text-warning",
    },
  ];

  return (
    <section id="demo" className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-[62ch]">
            <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
              Angka yang dilihat bendahara setiap pagi.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[62ch] text-base leading-relaxed">
              Ini tampilan asli modul keuangan Sera — bukan gambar mockup. Data
              di bawah ilustrasi tiga cabang, supaya bentuk laporannya terlihat
              sebelum sekolah membeli.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.title}
                  className="border-border bg-card rounded-3xl border p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-medium">
                      {kpi.title}
                    </p>
                    <Icon className={`size-4 ${kpi.color}`} aria-hidden />
                  </div>
                  <p className="text-foreground mt-3 text-xl font-bold tracking-tight tabular-nums">
                    {kpi.value}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                    {kpi.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Reveal delay={120}>
            <ChartCard
              title="Tunggakan vs Terbayar per Bulan"
              sub="Perbandingan nominal belum bayar dan sudah bayar"
            >
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MONTHLY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillTerbayar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TERBAYAR_COLOR} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={TERBAYAR_COLOR} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillTunggakan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TUNGGAKAN_COLOR} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={TUNGGAKAN_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} jt`} tickLine={false} axisLine={false} width={52} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="terbayar" name="Terbayar" stroke={TERBAYAR_COLOR} fill="url(#fillTerbayar)" strokeWidth={2} />
                  <Area type="monotone" dataKey="tunggakan" name="Tunggakan" stroke={TUNGGAKAN_COLOR} fill="url(#fillTunggakan)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={160}>
            <ChartCard
              title="Volume Tunggakan"
              sub="Jumlah item belum bayar per bulan"
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MONTHLY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                  <Bar dataKey="volume" name="Item belum bayar" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={120}>
            <ChartCard
              title="Distribusi Tunggakan per Branch"
              sub="Porsi total tunggakan masing-masing cabang"
            >
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={BY_BRANCH}
                    dataKey="tunggakan"
                    nameKey="branch"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {BY_BRANCH.map((_, i) => (
                      <Cell key={i} fill={`var(--chart-${i + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={160}>
            <ChartCard
              title="Tunggakan per Branch"
              sub="Nominal tunggakan masing-masing cabang"
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={BY_BRANCH} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} jt`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis type="category" dataKey="branch" width={140} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                  <Bar dataKey="tunggakan" name="Tunggakan" fill={TUNGGAKAN_COLOR} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>
        </div>

        <Reveal>
          <p className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>Ingin bentuk lengkapnya — rincian per branch dan per jenis tagihan?</span>
            <Link
              href="/produk/keuangan-sekolah"
              className="text-interactive hover:text-primary font-medium underline-offset-4 hover:underline"
            >
              Lihat modul keuangan
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
