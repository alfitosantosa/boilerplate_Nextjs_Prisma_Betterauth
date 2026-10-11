"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

/* Presensi is marked by letter, the way a class register is marked. */
type Mark = "H" | "S" | "I" | "A";

const MARKS: Mark[] = ["H", "S", "I", "A"];

const MARK_LABEL: Record<Mark, string> = {
  H: "Hadir",
  S: "Sakit",
  I: "Izin",
  A: "Alfa",
};

/* The domain map of DESIGN.md §1: sakit rides `warning`, izin rides `info`. */
const MARK_CHIP: Record<Mark, string> = {
  H: "bg-success-chip text-success-strong",
  S: "bg-warning-chip text-warning-strong",
  I: "bg-info-chip text-info-strong",
  A: "bg-destructive-chip text-destructive-strong",
};

const MARK_BAR: Record<Mark, string> = {
  H: "bg-success-strong",
  S: "bg-warning-strong",
  I: "bg-info-strong",
  A: "bg-destructive-strong",
};

type Status = "LUNAS" | "MENUNGGU" | "TUNGGAKAN";

const STATUS_CHIP: Record<Status, string> = {
  LUNAS: "border-success-border bg-success-surface text-success-strong",
  MENUNGGU: "border-warning-border bg-warning-surface text-warning-strong",
  TUNGGAKAN:
    "border-destructive-border bg-destructive-surface text-destructive-strong",
};

type Row = {
  kelas: string;
  nisn: string;
  nama: string;
  mark: Mark;
  surah: { arabic: string; latin: string; ayat: string };
  spp: number;
  status: Status;
};

/**
 * Illustrative rows. The data shapes are the platform's real ones —
 * `SurahQuran.name` / `nameLatin`, `TahfidzRecord.startVerse`,
 * `Attendance.status`, `Payment.status`. The students are not real people, and
 * the caption under the sheet says so.
 */
const ROWS: Row[] = [
  {
    kelas: "VII-A",
    nisn: "0071234567",
    nama: "Ahmad Fauzi N.",
    mark: "H",
    surah: { arabic: "البقرة", latin: "Al-Baqarah", ayat: "255" },
    spp: 450000,
    status: "LUNAS",
  },
  {
    kelas: "VII-A",
    nisn: "0071234581",
    nama: "Nabila Rahmawati",
    mark: "I",
    surah: { arabic: "النبأ", latin: "An-Naba", ayat: "1–20" },
    spp: 375000,
    status: "LUNAS",
  },
  {
    kelas: "VII-A",
    nisn: "0071234594",
    nama: "Hafizh Abdurrahman",
    mark: "H",
    surah: { arabic: "يس", latin: "Yasin", ayat: "1–12" },
    spp: 500000,
    status: "LUNAS",
  },
  {
    kelas: "VII-B",
    nisn: "0071234602",
    nama: "Salsabila Putri",
    mark: "S",
    surah: { arabic: "الملك", latin: "Al-Mulk", ayat: "1–10" },
    spp: 425000,
    status: "MENUNGGU",
  },
  {
    kelas: "VII-B",
    nisn: "0071234617",
    nama: "Ibrahim Malik",
    mark: "A",
    surah: { arabic: "الكهف", latin: "Al-Kahf", ayat: "1–10" },
    spp: 300000,
    status: "TUNGGAKAN",
  },
  {
    kelas: "VII-B",
    nisn: "0071234629",
    nama: "Khadijah Aulia",
    mark: "H",
    surah: { arabic: "الرحمن", latin: "Ar-Rahman", ayat: "1–13" },
    spp: 475000,
    status: "LUNAS",
  },
];

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

/**
 * The register, working. Marks are buttons: changing one moves the attendance
 * bar and the recap beneath it, which is the whole claim of the product in one
 * object — the record and its totals are the same thing.
 *
 * The recap is derived from `marks`, never stored, so the demo cannot drift
 * out of sync with what is on screen.
 */
export function RegisterDemo() {
  const [marks, setMarks] = useState<Record<string, Mark>>(() =>
    Object.fromEntries(ROWS.map((r) => [r.nisn, r.mark])),
  );
  const [revision, setRevision] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const counts = useMemo(
    () =>
      MARKS.map((mark) => ({
        mark,
        count: Object.values(marks).filter((m) => m === mark).length,
      })),
    [marks],
  );

  const total = ROWS.length;
  const hadir = counts.find((c) => c.mark === "H")?.count ?? 0;
  const diterima = ROWS.filter((r) => r.status === "LUNAS").reduce(
    (sum, r) => sum + r.spp,
    0,
  );
  const tertunggak = ROWS.reduce((sum, r) => sum + r.spp, 0) - diterima;

  const markStudent = (nisn: string, mark: Mark) => {
    setMarks((prev) => ({ ...prev, [nisn]: mark }));
    setSavedAt(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    setRevision((r) => r + 1);
  };

  const bar = reduce
    ? { transition: { duration: 0 } }
    : { transition: { type: "spring" as const, stiffness: 100, damping: 20 } };

  return (
    <figure className="m-0 min-w-0">
      <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-lg">
        {/* Sheet head: what this is, and the confirmation that it saved. */}
        <div className="border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-foreground text-sm font-medium">
              Register kelas VII-A dan VII-B
            </span>
            <span className="text-muted-foreground text-xs">Pekan ini</span>
          </div>

          <div className="flex min-h-5 items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {savedAt ? (
                <motion.span
                  key={revision}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-success-strong inline-flex items-center gap-1 text-xs font-medium"
                >
                  <Check className="size-3.5" aria-hidden />
                  Tersimpan {savedAt}
                </motion.span>
              ) : (
                <span className="text-muted-foreground text-xs">
                  Ketuk huruf untuk menandai
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* The attendance bar: one segment per mark, in register order. */}
        <div className="border-border border-b px-4 py-3">
          <div
            className="bg-muted flex h-2 gap-0.5 overflow-hidden rounded-full"
            role="img"
            aria-label={`Hadir ${hadir} dari ${total} siswa`}
          >
            {counts.map(({ mark, count }) =>
              count === 0 ? null : (
                <motion.span
                  key={mark}
                  className={`block h-full ${MARK_BAR[mark]}`}
                  initial={false}
                  animate={{ width: `${(count / total) * 100}%` }}
                  {...bar}
                />
              ),
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-xs tabular-nums">
            Hadir {hadir} dari {total} siswa
            {counts
              .filter((c) => c.mark !== "H" && c.count > 0)
              .map((c) => ` · ${MARK_LABEL[c.mark]} ${c.count}`)
              .join("")}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Contoh register presensi, setoran tahfidz, dan SPP untuk kelas
              VII-A dan VII-B. Ketuk huruf pada kolom presensi untuk mengubah
              catatan.
            </caption>
            <thead className="border-border border-b">
              <tr>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-2 text-xs font-medium"
                >
                  Kelas
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground hidden px-3 py-2 text-xs font-medium md:table-cell"
                >
                  NISN
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-2 text-xs font-medium"
                >
                  Nama siswa
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-2 text-center text-xs font-medium"
                >
                  Presensi
                </th>
                <th
                  scope="col"
                  className="border-border text-muted-foreground hidden border-l px-3 py-2 text-xs font-medium lg:table-cell"
                >
                  Setoran terakhir
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground hidden px-3 py-2 text-right text-xs font-medium sm:table-cell"
                >
                  SPP bulan ini
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-2 text-xs font-medium"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const current = marks[row.nisn];
                return (
                  <tr
                    key={row.nisn}
                    className="border-border border-b last:border-b-0"
                  >
                    <td className="text-muted-foreground px-3 py-3 text-xs">
                      {row.kelas}
                    </td>
                    <td className="text-muted-foreground hidden px-3 py-3 font-mono text-xs md:table-cell">
                      {row.nisn}
                    </td>
                    <td className="px-3 py-3 font-medium whitespace-nowrap">
                      {row.nama}
                    </td>
                    <td className="px-3 py-3">
                      <div
                        role="group"
                        aria-label={`Presensi ${row.nama}`}
                        className="flex items-center justify-center gap-0.5 sm:gap-1"
                      >
                        {MARKS.map((mark) => {
                          const on = current === mark;
                          return (
                            <button
                              key={mark}
                              type="button"
                              aria-pressed={on}
                              aria-label={`${row.nama}: ${MARK_LABEL[mark]}`}
                              onClick={() => markStudent(row.nisn, mark)}
                              className={`focus-visible:ring-ring/80 grid size-6 place-content-center rounded-lg text-xs font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none sm:size-7 ${
                                on
                                  ? MARK_CHIP[mark]
                                  : "text-muted-foreground hover:bg-accent border-border border"
                              }`}
                            >
                              {mark}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="border-border hidden border-l px-3 py-3 lg:table-cell">
                      <span className="font-arabic block text-[15px] leading-tight">
                        {row.surah.arabic}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {row.surah.latin} {row.surah.ayat}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                      {rupiah(row.spp)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CHIP[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <dl className="border-border bg-secondary/60 grid grid-cols-2 gap-x-6 gap-y-2 border-t px-4 py-3 sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs">SPP diterima</dt>
            <dd className="text-success-strong mt-0.5 text-sm font-semibold tabular-nums">
              {rupiah(diterima)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">SPP tertunggak</dt>
            <dd className="text-destructive-strong mt-0.5 text-sm font-semibold tabular-nums">
              {rupiah(tertunggak)}
            </dd>
          </div>
          <div className="col-span-2 hidden sm:block">
            <dt className="text-muted-foreground text-xs">Kuitansi</dt>
            <dd className="text-muted-foreground mt-0.5 font-mono text-sm tabular-nums">
              2026/SPP/VII-A/0031
            </dd>
          </div>
        </dl>
      </div>

      <figcaption className="text-muted-foreground mt-3 max-w-[68ch] text-xs">
        Contoh tampilan register. Nama dan angka pada tabel di atas adalah
        ilustrasi, bukan data siswa yang sebenarnya.
      </figcaption>
    </figure>
  );
}
