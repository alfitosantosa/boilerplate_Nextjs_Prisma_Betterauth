# Per-role Onboarding Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every dashboard user a role-specific `nextstepjs` tour that starts by itself the first time they reach the dashboard and can be replayed from the header.

**Architecture:** `nextstepjs` (`NextStepProvider` + `NextStep`) mounts around the dashboard shell only, inside the existing sidebar branch of `components/ConditionalLayout.tsx`. Tours are built per role from one definition file; completion lives in `localStorage` keyed per user per tour, so there is no schema change. The role→menu-key resolver that `appSidebar` keeps as a closure is extracted to a shared module so the sidebar and the tour cannot drift apart.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, TanStack Query, Better Auth, `nextstepjs@2.3.0` (+ `motion`, already a dependency).

**Spec:** `docs/superpowers/specs/2026-10-11-onboarding-tour-nextstepjs-design.md`

## Global Constraints

- UI copy and toast text are **100% Bahasa Indonesia**; identifiers stay English.
- **No emoji anywhere** — icons are lucide components.
- Prisma is not touched: no migration, no schema edit, no new API route.
- `nextstepjs` peer floor is `next: >=13`, `react: >=18`, `motion: >=11` — satisfied by Next 16.3.3 / React 19.2.8 / motion 12.43.0.
- With a custom `cardComponent`, steps must **not** carry `showControls` / `showSkip` — the library's `TourWithCustomCard` type omits them.
- A step with no `selector` renders its card centered; a `selector` that matches nothing behaves the same. Never point a step at a table row or a metric.
- The 3 dead menu URLs — `/dashboard/attendance`, `/dashboard/recapattendance`, `/dashboard/recapattendance/class` — have no `page.tsx` and must never appear in a tour.
- Next.js 16 breaking changes apply: read the relevant guide in `node_modules/next/dist/docs/` before using an unfamiliar API.
- Verification gates for this repo: `bunx tsc --noEmit`, `bun run build`, and scripted checks (there is no test runner; `bun:test` is unavailable because `@types/bun` is not installed).

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/ui/roleKey.ts` | `getRoleMenuKey(role, school?)` — role name → `menuGroups` key. Pure. |
| `lib/tours/tourModel.ts` | Tour keys, menu-key→tour-key map, `localStorage` key shape and read/write. Pure, no React. |
| `lib/tours/selectors.ts` | The 4 selectors a tour may target, plus the `data-tour` attribute names. |
| `lib/tours/tours.ts` | `TOUR_ROUTES`, `ALL_TOUR_ROUTES`, `buildTours({ desktop, menuKey })` and all step copy. `.ts`, not `.tsx`: content is a string, no step renders an icon. |
| `lib/tours/useTour.ts` | The only React in `lib/tours`: `useTourKey()`, `useTourAutoStart()`, `useTourReplay()`. |
| `lib/tours/tour.check.ts` | Runnable self-check (no framework) for everything above, including "every tour route has a `page.tsx`". |
| `components/tour/TourCard.tsx` | The card, in house style. |
| `components/tour/TourProvider.tsx` | Mounts `NextStepProvider` + `NextStep`; owns the done/skip writes. |
| `components/tour/TourReplayButton.tsx` | Header entry point that restarts the user's tour. |

Modified: `components/appSidebar.tsx` (import the extracted resolver), `components/ConditionalLayout.tsx` (mount the provider, mark the header, render the replay button), `AGENTS.md` (§Testing: record the new check).

No dashboard page is modified — page steps deliberately carry no selector (spec §5).

---

### Task 1: Install nextstepjs and extract the role→menu resolver

**Files:**
- Modify: `package.json`, `bun.lock` (via `bun add`)
- Create: `lib/ui/roleKey.ts`
- Modify: `components/appSidebar.tsx:148-182` (replace the local `getRoleMenuKey` with an import)

**Interfaces:**
- Consumes: nothing.
- Produces: `getRoleMenuKey(role: string, school?: string | null): string` from `@/lib/ui/roleKey`. Task 3's tour hook and the sidebar both call it.

- [ ] **Step 1: Install the dependency**

```bash
bun add nextstepjs
```

Expected: `nextstepjs@2.3.0` in `dependencies`. `motion` is already listed under `dependencies` (`^12.43.0`) — do not add it again. `bun` may warn about the optional `react-router` / `@remix-run/react` peers; that is expected and harmless.

- [ ] **Step 2: Create the shared resolver**

Create `lib/ui/roleKey.ts`. This is the closure currently at `components/appSidebar.tsx:148-182`, unchanged except that `school` becomes a parameter and the dead trailing `if (r.includes("admin school")) return "schooladministrator";` (already handled by the first branch) is dropped:

```ts
/**
 * Role name → `menuGroups` key. Extracted from `components/appSidebar.tsx`, which used it
 * as a closure over its own `school` state; the sidebar and the onboarding tour now share
 * this one mapping so the two cannot drift apart.
 *
 * `role` is `user_data.role.name` — free text, hence the `includes` matching.
 * `school` is the selected branch id: an admin/yayasan who picked a branch sees the
 * school-scoped menu set.
 */
export function getRoleMenuKey(role: string, school?: string | null): string {
  const r = role.toLowerCase();

  // Admin School role — always use the schooladministrator menu
  if (r.includes("admin school")) return "schooladministrator";

  // Admin/yayasan that selected a specific school
  if (
    (r.includes("admin") || r.includes("yayasan")) &&
    school &&
    school !== "all"
  ) {
    return "schooladministrator";
  }

  if (r.includes("admin") || r.includes("yayasan")) return "admin";
  if (r.includes("bendahara") || r.includes("treasurer")) return "treasurer";
  if (
    r.includes("teacher") ||
    r.includes("head of school") ||
    r.includes("guru") ||
    r.includes("kepala sekolah")
  ) {
    return "teacher";
  }
  if (r.includes("student") || r.includes("siswa")) return "student";
  if (r.includes("parent") || r.includes("orang tua")) return "parent";

  return "null";
}
```

- [ ] **Step 3: Rewire the sidebar**

In `components/appSidebar.tsx`, add the import next to the other `@/lib` imports:

```ts
import { getRoleMenuKey } from "@/lib/ui/roleKey";
```

Then delete the whole local declaration `const getRoleMenuKey = (role: string): string => { … };` and change the call site so it passes the branch state the closure used to capture:

```ts
const roleMenuKey = getRoleMenuKey(userRole, school);
```

- [ ] **Step 4: Type-check**

Run: `bunx tsc --noEmit`
Expected: no errors. (A missed call site would fail here as "Expected 2 arguments".)

- [ ] **Step 5: Confirm the sidebar still compiles in dev**

The dev server is already running on `http://localhost:8999`. Run:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8999/dashboard
```

Expected: `200` (dev has no auth redirect — `proxy.ts` only redirects when `NODE_ENV === "production"`), and no error in the `lmsdev` service log.

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock lib/ui/roleKey.ts components/appSidebar.tsx
git commit -m "feat: extract role to menu key resolver, add nextstepjs"
```

---

### Task 2: Pure tour state and its self-check

**Files:**
- Create: `lib/tours/tourModel.ts`
- Create: `lib/tours/tour.check.ts`

**Interfaces:**
- Consumes: `getRoleMenuKey` from Task 1 (asserted only).
- Produces: `TOUR_KEYS`, `TourKey`, `isTourKey(name: string): name is TourKey`, `tourKeyForMenuKey(menuKey: string): TourKey | null`, `storageKey(userId: string, tourKey: TourKey): string`, `readTourDone(userId: string, tourKey: TourKey): boolean`, `writeTourDone(userId: string, tourKey: TourKey): void`.

- [ ] **Step 1: Write the failing check**

Create `lib/tours/tour.check.ts` (header style copied from `lib/rabbitMQ/retry.check.ts`):

```ts
/**
 * Self-check untuk logika murni tur onboarding.
 *
 * Jalankan: `bun run lib/tours/tour.check.ts`
 *
 * Sengaja tanpa framework: repo ini belum punya test runner, dan `bun:test` butuh
 * @types/bun (belum terpasang) yang membuat `tsc --noEmit` gagal.
 */
import assert from "node:assert/strict";

import { getRoleMenuKey } from "../ui/roleKey";
import { isTourKey, storageKey, tourKeyForMenuKey } from "./tourModel";

// role -> menu key: perilaku hasil ekstraksi dari appSidebar, tidak boleh berubah.
assert.equal(getRoleMenuKey("Admin Yayasan"), "admin");
assert.equal(getRoleMenuKey("admin school"), "schooladministrator");
assert.equal(getRoleMenuKey("Admin Yayasan", "br_1"), "schooladministrator");
assert.equal(getRoleMenuKey("Admin Yayasan", "all"), "admin");
assert.equal(getRoleMenuKey("bendahara"), "treasurer");
assert.equal(getRoleMenuKey("Treasurer"), "treasurer");
assert.equal(getRoleMenuKey("Guru"), "teacher");
assert.equal(getRoleMenuKey("Kepala Sekolah"), "teacher");
assert.equal(getRoleMenuKey("Siswa"), "student");
assert.equal(getRoleMenuKey("Orang Tua"), "parent");
assert.equal(getRoleMenuKey("Tanpa Role"), "null");

// menu key -> tur
assert.equal(tourKeyForMenuKey("admin"), "admin");
assert.equal(tourKeyForMenuKey("schooladministrator"), "admin");
assert.equal(tourKeyForMenuKey("treasurer"), "treasurer");
assert.equal(tourKeyForMenuKey("teacher"), "teacher");
assert.equal(tourKeyForMenuKey("student"), "student");
assert.equal(tourKeyForMenuKey("parent"), "parent");
assert.equal(tourKeyForMenuKey("null"), null);
assert.equal(tourKeyForMenuKey(""), null);

// nama tur yang datang dari callback nextstepjs hanya diterima kalau memang kunci kita
assert.equal(isTourKey("admin"), true);
assert.equal(isTourKey("adminn"), false);
assert.equal(isTourKey(""), false);

// bentuk kunci penyimpanan: per user, per tur, berversi
assert.equal(storageKey("u1", "admin"), "lms.tour.v1.u1.admin");
assert.equal(storageKey("u2", "parent"), "lms.tour.v1.u2.parent");

console.log("tour.check.ts: semua assert lolos");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run lib/tours/tour.check.ts`
Expected: FAIL — `Cannot find module './tourModel'`.

- [ ] **Step 3: Write the model**

Create `lib/tours/tourModel.ts`:

```ts
/**
 * Keadaan tur yang murni — tanpa React dan tanpa DOM, supaya `tour.check.ts` bisa
 * menjalankannya lewat `bun run` tanpa framework.
 *
 * Status hidup di localStorage, berkunci per user per tur, jadi tidak perlu perubahan
 * schema. Pembacaan yang gagal (mode privat, storage dimatikan) melaporkan "belum
 * selesai": arah yang aman — dashboard tidak boleh rusak hanya karena storage.
 */
export const TOUR_KEYS = [
  "admin",
  "treasurer",
  "teacher",
  "student",
  "parent",
] as const;

export type TourKey = (typeof TOUR_KEYS)[number];

const STORAGE_PREFIX = "lms.tour.v1";
const DONE = "done";

/** Callback nextstepjs mengirim `string | null`; hanya kunci kita yang boleh ditulis. */
export function isTourKey(name: string): name is TourKey {
  return (TOUR_KEYS as readonly string[]).includes(name);
}

/**
 * Kunci `menuGroups` → kunci tur. `schooladministrator` memakai tur `admin` dengan daftar
 * langkah yang disaring; `null` (resolver tidak mengenali role) berarti tidak ada tur.
 */
export function tourKeyForMenuKey(menuKey: string): TourKey | null {
  if (menuKey === "admin" || menuKey === "schooladministrator") return "admin";
  if (menuKey === "treasurer") return "treasurer";
  if (menuKey === "teacher") return "teacher";
  if (menuKey === "student") return "student";
  if (menuKey === "parent") return "parent";
  return null;
}

export function storageKey(userId: string, tourKey: TourKey): string {
  return `${STORAGE_PREFIX}.${userId}.${tourKey}`;
}

export function readTourDone(userId: string, tourKey: TourKey): boolean {
  try {
    return window.localStorage.getItem(storageKey(userId, tourKey)) === DONE;
  } catch {
    return false;
  }
}

export function writeTourDone(userId: string, tourKey: TourKey): void {
  try {
    window.localStorage.setItem(storageKey(userId, tourKey), DONE);
  } catch {
    // Storage tidak tersedia — tur cukup berjalan lagi pada kunjungan berikutnya.
  }
}
```

- [ ] **Step 4: Run the check to verify it passes**

Run: `bun run lib/tours/tour.check.ts`
Expected: `tour.check.ts: semua assert lolos`

- [ ] **Step 5: Type-check**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/tours/tourModel.ts lib/tours/tour.check.ts
git commit -m "feat: pure tour state model with self-check"
```

---

### Task 3: Tour definitions

**Files:**
- Create: `lib/tours/selectors.ts`, `lib/tours/tours.ts`
- Modify: `lib/tours/tour.check.ts` (append the route and step-shape assertions)

**Interfaces:**
- Consumes: `TourKey` from Task 2.
- Produces: `SELECTORS`, `TOUR_ATTR`, `TOUR_HEADER` from `selectors.ts`; `TOUR_ROUTES`, `ALL_TOUR_ROUTES`, `buildTours({ desktop, menuKey }): Tour[]` from `tours.ts`.

- [ ] **Step 1: Write the failing assertions**

Append to `lib/tours/tour.check.ts` (after the storage-key asserts, before the final `console.log`):

```ts
// Setiap rute yang dipakai tur harus punya page.tsx — kalau tidak, tur menabrak 404.
const pagesDir = join(import.meta.dir, "..", "..", "app", "(frontend)", "(dashboard)");
assert.ok(ALL_TOUR_ROUTES.length >= 19, `rute tur mengecil tak terduga: ${ALL_TOUR_ROUTES.length}`);
for (const route of ALL_TOUR_ROUTES) {
  assert.ok(
    existsSync(join(pagesDir, `${route}/page.tsx`)),
    `rute tur tanpa halaman: ${route}`,
  );
}

// Tur admin: langkah tingkat yayasan hanya untuk menuKey admin, bukan schooladministrator.
const routesOf = (tour: Tour): string[] =>
  tour.steps.flatMap((step) =>
    [step.nextRoute, step.prevRoute].filter((r): r is string => typeof r === "string"),
  );
const adminTour = buildTours({ desktop: true, menuKey: "admin" }).find((t) => t.tour === "admin");
const schoolTour = buildTours({ desktop: true, menuKey: "schooladministrator" }).find(
  (t) => t.tour === "admin",
);
assert.ok(adminTour && schoolTour);
assert.ok(routesOf(adminTour).includes(TOUR_ROUTES.admin.academicYear));
assert.ok(!routesOf(schoolTour).includes(TOUR_ROUTES.admin.academicYear));
assert.ok(routesOf(schoolTour).includes(TOUR_ROUTES.admin.attendance));

// Desktop memakai anchor sidebar; mobile menggantinya dengan tombol pembuka sidebar.
const desktopAdmin = adminTour.steps.map((s) => s.selector);
assert.ok(desktopAdmin.includes(SELECTORS.sidebarNav));
assert.ok(desktopAdmin.includes(SELECTORS.sidebarFooter));
const mobileAdmin = buildTours({ desktop: false, menuKey: "admin" })
  .find((t) => t.tour === "admin")!
  .steps.map((s) => s.selector);
assert.ok(mobileAdmin.includes(SELECTORS.sidebarTrigger));
assert.ok(!mobileAdmin.includes(SELECTORS.sidebarNav));
assert.ok(!mobileAdmin.includes(SELECTORS.sidebarFooter));

// Lima tur, semua berisi langkah berjudul dan berisi teks.
const semua = buildTours({ desktop: true, menuKey: "student" });
assert.deepEqual(
  semua.map((t) => t.tour),
  ["admin", "treasurer", "teacher", "student", "parent"],
);
for (const tour of semua) {
  assert.ok(tour.steps.length > 0, `tur kosong: ${tour.tour}`);
  for (const step of tour.steps) {
    assert.ok(step.title.length > 0, `langkah tanpa judul di ${tour.tour}`);
    assert.ok(String(step.content).length > 0, `langkah tanpa isi di ${tour.tour}`);
  }
}
```

Extend the import block at the top of the same file:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Tour } from "nextstepjs";

import { getRoleMenuKey } from "../ui/roleKey";
import { SELECTORS, TOUR_ATTR, TOUR_HEADER } from "./selectors";
import { isTourKey, storageKey, tourKeyForMenuKey } from "./tourModel";
import { ALL_TOUR_ROUTES, buildTours, TOUR_ROUTES } from "./tours";

// `data-tour` di header dipasang lewat konstanta ini; pastikan tidak tertukar.
assert.equal(SELECTORS.header, `[${TOUR_ATTR}="${TOUR_HEADER}"]`);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run lib/tours/tour.check.ts`
Expected: FAIL — `Cannot find module './selectors'`.

- [ ] **Step 3: Write the selectors**

Create `lib/tours/selectors.ts`:

```ts
/**
 * Satu-satunya elemen yang boleh disorot tur, plus nama atribut penandanya.
 * Dikumpulkan di satu berkas supaya perubahan pada shell hanya menyentuh satu tempat.
 */
export const TOUR_ATTR = "data-tour";

/** Nilai `data-tour` pada header shell di `components/ConditionalLayout.tsx`. */
export const TOUR_HEADER = "header";

export const SELECTORS = {
  /** Kolom navigasi sidebar yang bisa di-scroll. */
  sidebarNav: '[data-slot="sidebar-content"]',
  /** Blok profil di kaki sidebar. */
  sidebarFooter: '[data-slot="sidebar-footer"]',
  /** Header shell dashboard. */
  header: `[${TOUR_ATTR}="${TOUR_HEADER}"]`,
  /** Tombol pembuka sidebar di bawah `md`, saat sidebar jadi sheet. */
  sidebarTrigger: '[data-slot="sidebar-trigger"]',
} as const;
```

- [ ] **Step 4: Write the tours**

Create `lib/tours/tours.ts`:

```ts
import type { Step, Tour } from "nextstepjs";

import { SELECTORS } from "./selectors";
import type { TourKey } from "./tourModel";

/**
 * Rute yang dinavigasi tiap tur. Semuanya sudah diverifikasi punya `page.tsx`; tiga URL
 * di `menuGroups` tidak dipakai karena halamannya tidak ada:
 * `/dashboard/attendance`, `/dashboard/recattendance`, `/dashboard/recapattendance/class`.
 */
export const TOUR_ROUTES = {
  admin: {
    academicYear: "/dashboard/admin/master/academicyear",
    branchs: "/dashboard/admin/master/branchs",
    users: "/dashboard/admin/master/users",
    classes: "/dashboard/admin/master/classes",
    attendance: "/dashboard/admin/attendance",
  },
  treasurer: {
    paymentType: "/dashboard/treasurer/paymenttype",
    billing: "/dashboard/treasurer/billing",
    payment: "/dashboard/treasurer/payment",
    studentInformation: "/dashboard/treasurer/studentinformation",
  },
  teacher: {
    schedule: "/dashboard/teacher/schedule",
    attendance: "/dashboard/teacher/attendance",
    exam: "/dashboard/teacher/exam",
    violations: "/dashboard/teacher/violations",
  },
  student: {
    schedule: "/dashboard/student/schedule",
    attendance: "/dashboard/student/attendance",
    tahfidz: "/dashboard/student/tahfidzrecord",
    payment: "/dashboard/student/payment",
  },
  parent: {
    portal: "/dashboard/parent",
    development: "/dashboard/parent/development",
    report: "/dashboard/parent/development/report",
  },
} as const;

/** Semua rute tur, untuk diperiksa `tour.check.ts` terhadap filesystem. */
export const ALL_TOUR_ROUTES: string[] = Object.values(TOUR_ROUTES).flatMap((routes) =>
  Object.values(routes),
);

/** Opsi untuk langkah yang menyorot elemen. */
const ANCHOR = {
  pointerPadding: 8,
  pointerRadius: 12,
  // Header dashboard sticky: tanpa ini sorotan di dekat tepi atas tertutup header.
  scrollOffset: 88,
  // Halaman merender setelah query-nya selesai.
  selectorRetryAttempts: 3,
  selectorRetryDelay: 250,
} as const;

/**
 * Langkah halaman sengaja TANPA selector: kartunya tampil di tengah dan `nextRoute` yang
 * memindahkan pengguna. 19 dari 20 halaman yang dikunjungi tidak punya judul level
 * halaman, jadi anchor per halaman akan rapuh; nextstepjs juga tidak punya fallback
 * selector — selector yang tidak ketemu berakhir sebagai kartu tengah, persis seperti ini.
 */
type PageStep = { route: string; title: string; content: string };

function pageSteps(pages: PageStep[]): Step[] {
  return pages.map((page, index) => ({
    title: page.title,
    content: page.content,
    // Langkah terakhir tidak mengarahkan apa-apa: langkah penutup ada di sidebar.
    ...(index < pages.length - 1 ? { nextRoute: pages[index + 1].route } : {}),
    ...(index > 0 ? { prevRoute: pages[index - 1].route } : {}),
  }));
}

const NAV_STEP: Step = {
  title: "Menu kerja Anda",
  content:
    "Semua modul yang bisa Anda buka ada di sini, dikelompokkan per kebutuhan. Isinya mengikuti role akun ini.",
  selector: SELECTORS.sidebarNav,
  side: "right",
  ...ANCHOR,
};

const HEADER_STEP: Step = {
  title: "Header dashboard",
  content:
    "Di layar kecil, tombol kiri atas membuka dan menutup menu. Tombol Panduan di kanan memutar tur ini lagi kapan saja.",
  selector: SELECTORS.header,
  side: "bottom",
  ...ANCHOR,
};

const MOBILE_NAV_STEP: Step = {
  title: "Menu kerja Anda",
  content:
    "Tombol ini membuka seluruh menu. Isinya mengikuti role akun ini.",
  selector: SELECTORS.sidebarTrigger,
  side: "bottom",
  ...ANCHOR,
};

const CLOSING_STEP: Step = {
  title: "Akun Anda",
  content:
    "Profil, ganti akun, dan keluar ada di sini. Tur ini bisa diputar ulang dari tombol Panduan.",
  selector: SELECTORS.sidebarFooter,
  side: "right",
  ...ANCHOR,
};

const ADMIN_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.admin.academicYear,
    title: "Mulai dari Tahun Ajaran",
    content:
      "Buat tahun ajaran lebih dulu. Kelas, jadwal, dan tagihan menempel ke tahun ajaran yang aktif.",
  },
  {
    route: TOUR_ROUTES.admin.branchs,
    title: "Daftarkan tiap sekolah",
    content:
      "SMP, SMA, dan SMK IT didaftarkan sebagai cabang. Data antar cabang terpisah, termasuk rekening kasnya.",
  },
  {
    route: TOUR_ROUTES.admin.users,
    title: "Undang guru, siswa, dan orang tua",
    content:
      "Akun dibuat di sini. Pengguna hanya melihat data cabangnya sendiri.",
  },
  {
    route: TOUR_ROUTES.admin.classes,
    title: "Susun kelas",
    content:
      "Setelah tahun ajaran ada, susun kelas dan wali kelasnya.",
  },
  {
    route: TOUR_ROUTES.admin.attendance,
    title: "Presensi harian",
    content:
      "Guru menandai kehadiran per jam pelajaran. Rekapnya masuk ke halaman rekapitulasi.",
  },
];

/** Admin sekolah: tanpa langkah tingkat yayasan, yang memang tidak ada di menunya. */
const ADMIN_SCHOOL_PAGES: PageStep[] = [ADMIN_PAGES[3], ADMIN_PAGES[4]];

const TREASURER_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.treasurer.paymentType,
    title: "Jenis tagihan",
    content:
      "SPP bulanan, uang gedung, seragam, dan ujian didaftarkan di sini beserta tarifnya. Tagihan lahir dari daftar ini.",
  },
  {
    route: TOUR_ROUTES.treasurer.billing,
    title: "Susun tagihan",
    content:
      "Tagihan dibuat per siswa per jenis. Yang belum dibayar otomatis terbaca sebagai tunggakan.",
  },
  {
    route: TOUR_ROUTES.treasurer.payment,
    title: "Verifikasi pembayaran",
    content:
      "Pembayaran online lewat Midtrans masuk sendiri. Transfer manual Anda verifikasi di sini, lalu kuitansi bernomor terbit.",
  },
  {
    route: TOUR_ROUTES.treasurer.studentInformation,
    title: "Data siswa dan tunggakan",
    content:
      "Satu siswa satu baris: tagihan, pembayaran, dan sisanya.",
  },
];

const TEACHER_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.teacher.schedule,
    title: "Jadwal mengajar",
    content:
      "Jadwal pelajaran pekan ini. Presensi per jam diisi dari sini.",
  },
  {
    route: TOUR_ROUTES.teacher.attendance,
    title: "Presensi kelas",
    content:
      "Tandai hadir, sakit, izin, atau alfa per siswa per jadwal.",
  },
  {
    route: TOUR_ROUTES.teacher.exam,
    title: "Ujian dan nilai",
    content:
      "Bank soal, jadwal ujian, dan nilai terkumpul di satu tempat.",
  },
  {
    route: TOUR_ROUTES.teacher.violations,
    title: "Pelanggaran siswa",
    content:
      "Catat pelanggaran; poinnya terakumulasi per siswa.",
  },
];

const STUDENT_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.student.schedule,
    title: "Jadwal pelajaran",
    content: "Jadwal pekan ini, per jam dan per guru.",
  },
  {
    route: TOUR_ROUTES.student.attendance,
    title: "Presensi saya",
    content: "Kehadiran yang dicatat guru untuk Anda, per jam pelajaran.",
  },
  {
    route: TOUR_ROUTES.student.tahfidz,
    title: "Setoran hafalan",
    content:
      "Surah, rentang ayat, dan nilai setiap setoran, tersusun per tanggal.",
  },
  {
    route: TOUR_ROUTES.student.payment,
    title: "Tagihan SPP",
    content:
      "Tagihan yang harus dibayar beserta statusnya; kuitansi bisa diunduh setelah lunas.",
  },
];

const PARENT_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.parent.portal,
    title: "Ringkasan anak",
    content:
      "Yang terjadi di sekolah hari itu: presensi, catatan guru, dan tagihan.",
  },
  {
    route: TOUR_ROUTES.parent.development,
    title: "Perkembangan anak",
    content: "Nilai, tugas, dan catatan perkembangan per periode.",
  },
  {
    route: TOUR_ROUTES.parent.report,
    title: "Rapor",
    content: "Rapor disusun dari catatan yang sama, bukan entri ulang.",
  },
];

/**
 * Lima tur, satu per role. `schooladministrator` memakai tur `admin` dengan daftar langkah
 * yang disaring, jadi tidak ada langkah menuju rute yang menunya tidak ada.
 */
export function buildTours({
  desktop,
  menuKey,
}: {
  desktop: boolean;
  menuKey: string;
}): Tour[] {
  const chrome: Step[] = desktop ? [NAV_STEP, HEADER_STEP] : [MOBILE_NAV_STEP];
  const adminPages = menuKey === "schooladministrator" ? ADMIN_SCHOOL_PAGES : ADMIN_PAGES;

  return [
    { tour: "admin" satisfies TourKey, steps: [...chrome, ...pageSteps(adminPages), CLOSING_STEP] },
    {
      tour: "treasurer" satisfies TourKey,
      steps: [...chrome, ...pageSteps(TREASURER_PAGES), CLOSING_STEP],
    },
    {
      tour: "teacher" satisfies TourKey,
      steps: [...chrome, ...pageSteps(TEACHER_PAGES), CLOSING_STEP],
    },
    {
      tour: "student" satisfies TourKey,
      steps: [...chrome, ...pageSteps(STUDENT_PAGES), CLOSING_STEP],
    },
    {
      tour: "parent" satisfies TourKey,
      steps: [...chrome, ...pageSteps(PARENT_PAGES), CLOSING_STEP],
    },
  ];
}
```

- [ ] **Step 5: Run the check to verify it passes**

Run: `bun run lib/tours/tour.check.ts`
Expected: `tour.check.ts: semua assert lolos`. A failure naming a route means a route in `TOUR_ROUTES` has no `page.tsx` — fix the route, never the assertion.

- [ ] **Step 6: Type-check**

Run: `bunx tsc --noEmit`
Expected: no errors. Note `satisfies TourKey` fails the build if a tour key is renamed without updating `TOUR_KEYS`.

- [ ] **Step 7: Commit**

```bash
git add lib/tours/selectors.ts lib/tours/tours.ts lib/tours/tour.check.ts
git commit -m "feat: per-role tour definitions with route assertions"
```

---

### Task 4: Mount the tour on the dashboard shell

**Files:**
- Create: `lib/tours/useTour.ts`, `components/tour/TourCard.tsx`, `components/tour/TourProvider.tsx`, `components/tour/TourReplayButton.tsx`
- Modify: `components/ConditionalLayout.tsx`

**Interfaces:**
- Consumes: `buildTours` (Task 3), `SELECTORS` / `TOUR_HEADER` (Task 3), `readTourDone` / `writeTourDone` / `isTourKey` / `tourKeyForMenuKey` (Task 2), `getRoleMenuKey` (Task 1).
- Produces: `useTourKey()`, `useTourAutoStart()`, `useTourReplay()`; `<TourProvider>`, `<TourCard>`, `<TourReplayButton>`.

- [ ] **Step 1: Write the hooks**

Create `lib/tours/useTour.ts`:

```ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useNextStep } from "nextstepjs";
import { useSearchParams } from "next/navigation";

import { useBranch } from "@/app/(context)/BranchContext";
import { useGetUserByIdBetterAuth } from "@/app/(hooks)/hooks/Users/useUsersByIdBetterAuth";
import { useSession } from "@/lib/betterauth/authClients";
import { getRoleMenuKey } from "@/lib/ui/roleKey";
import { readTourDone, tourKeyForMenuKey, type TourKey } from "./tourModel";

/** Beri waktu shell mengecat dulu sebelum overlay muncul. */
const START_DELAY_MS = 600;

/**
 * User yang login dan tur untuk role-nya. Resolusinya sengaja sama dengan `AppSidebar`:
 * role dari `user_data.role.name`, cabang dari query `branchId` atau BranchContext.
 */
export function useTourKey(): {
  userId: string | null;
  menuKey: string | null;
  tourKey: TourKey | null;
} {
  const { data: session } = useSession();
  const { data: userData } = useGetUserByIdBetterAuth(session?.user?.id ?? "");
  const { selectedBranchId } = useBranch();
  const searchParams = useSearchParams();

  const userId = session?.user?.id ?? null;
  const roleName = userData?.role?.name;
  const school = searchParams?.get("branchId") ?? selectedBranchId ?? "all";
  const menuKey = roleName ? getRoleMenuKey(roleName, school) : null;

  return { userId, menuKey, tourKey: menuKey ? tourKeyForMenuKey(menuKey) : null };
}

/** Menjalankan tur role sekali per browser, saat pengguna pertama kali masuk dashboard. */
export function useTourAutoStart(): void {
  const { startNextStep } = useNextStep();
  const { userId, tourKey } = useTourKey();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !userId || !tourKey) return;
    if (readTourDone(userId, tourKey)) return;

    // Latch sebelum timer dipasang, dan sengaja TANPA cleanup: StrictMode melakukan
    // mount -> unmount -> mount, cleanup akan membatalkan timer sementara latch menahan
    // efek kedua sehingga tur tidak pernah jalan.
    started.current = true;
    setTimeout(() => startNextStep(tourKey), START_DELAY_MS);
  }, [userId, tourKey, startNextStep]);
}

/** Titik masuk tombol Panduan. */
export function useTourReplay(): { replay: () => void; canReplay: boolean } {
  const { startNextStep } = useNextStep();
  const { tourKey } = useTourKey();

  const replay = useCallback(() => {
    if (tourKey) startNextStep(tourKey);
  }, [startNextStep, tourKey]);

  return { replay, canReplay: tourKey !== null };
}
```

- [ ] **Step 2: Write the card**

Create `components/tour/TourCard.tsx`:

```tsx
"use client";

import type { CardComponentProps } from "nextstepjs";

import { Button } from "@/components/ui/button";

/**
 * Kartu tur dalam gaya rumah: token warna repo, radius panel, dan Button yang sama
 * dengan sisa aplikasi. nextstepjs menempatkan dan menganimasikan kartu ini; komponen
 * ini hanya mengisi isinya dan mengurus tombolnya.
 */
export function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: CardComponentProps) {
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="border-border bg-card w-[min(22rem,calc(100vw-2rem))] rounded-3xl border p-5 shadow-lg">
      <p className="text-muted-foreground text-xs font-medium tabular-nums">
        Langkah {currentStep + 1} dari {totalSteps}
      </p>
      <h2 className="text-foreground mt-2 text-base font-semibold tracking-tight">
        {step.title}
      </h2>
      <div className="text-secondary-foreground mt-2 text-sm leading-relaxed text-pretty">
        {step.content}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={skipTour}
          className="text-muted-foreground"
        >
          Lewati
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Kembali
          </Button>
          <Button type="button" size="sm" onClick={nextStep}>
            {isLast ? "Selesai" : "Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write the provider**

Create `components/tour/TourProvider.tsx`:

```tsx
"use client";

import { NextStep, NextStepProvider, type Tour } from "nextstepjs";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { useSession } from "@/lib/betterauth/authClients";
import { buildTours } from "@/lib/tours/tours";
import { isTourKey, writeTourDone } from "@/lib/tours/tourModel";
import { useTourAutoStart, useTourKey } from "@/lib/tours/useTour";
import { TourCard } from "./TourCard";

const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Tur onboarding, dipasang hanya di sekitar shell dashboard — halaman landing dan auth
 * tidak ikut tersentuh.
 */
export function TourProvider({ children }: { children: ReactNode }) {
  const { userId, menuKey } = useTourKey();
  const [mounted, setMounted] = useState(false);
  const [desktop, setDesktop] = useState(true);

  // Tur murni klien: `matchMedia` dan `localStorage` tidak ada saat SSR, dan nextstepjs
  // tidak boleh ikut dirender ke HTML server.
  useEffect(() => {
    setDesktop(window.matchMedia(DESKTOP_QUERY).matches);
    setMounted(true);
  }, []);

  const tours: Tour[] = useMemo(
    () => buildTours({ desktop, menuKey: menuKey ?? "null" }),
    [desktop, menuKey],
  );

  const markDone = (tourName: string | null) => {
    if (userId && tourName && isTourKey(tourName)) writeTourDone(userId, tourName);
  };

  if (!mounted) return <NextStepProvider>{children}</NextStepProvider>;

  return (
    <NextStepProvider>
      <NextStep
        steps={tours}
        cardComponent={TourCard}
        onComplete={markDone}
        onSkip={(_step, tourName) => markDone(tourName)}
        // Jangan lompat ke atas halaman setelah tur selesai.
        scrollToTop={false}
      >
        {children}
      </NextStep>
      <TourAutoStart />
    </NextStepProvider>
  );
}

/** Komponen daun tersendiri supaya bisa memanggil `useNextStep()` dari dalam provider. */
function TourAutoStart() {
  useTourAutoStart();
  return null;
}
```

- [ ] **Step 4: Write the replay button**

Create `components/tour/TourReplayButton.tsx`:

```tsx
"use client";

import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTourReplay } from "@/lib/tours/useTour";

/** Tombol Panduan di header shell: memutar ulang tur role pengguna. */
export function TourReplayButton() {
  const { replay, canReplay } = useTourReplay();

  if (!canReplay) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={replay}
      className="text-muted-foreground gap-1.5"
    >
      <Compass />
      <span className="hidden sm:inline">Panduan</span>
      <span className="sr-only sm:hidden">Panduan</span>
    </Button>
  );
}
```

- [ ] **Step 5: Mount it in the shell**

In `components/ConditionalLayout.tsx`, add the imports:

```ts
import { TourProvider } from "@/components/tour/TourProvider";
import { TourReplayButton } from "@/components/tour/TourReplayButton";
import { TOUR_HEADER } from "@/lib/tours/selectors";
```

and replace the sidebar branch's return with:

```tsx
  // Render dengan sidebar
  return (
    <SidebarProvider>
      <TourProvider>
        <AppSidebar />
        <SidebarInset className="bg-background flex min-h-screen flex-col">
          <header
            data-tour={TOUR_HEADER}
            className="bg-background/95 supports-backdrop-filter:bg-background/60 border-border sticky shrink-0 items-center gap-2 border-b px-4 py-7 backdrop-blur md:px-6"
          >
            <SidebarTrigger className="" />
            <div className="flex-1" />
            <TourReplayButton />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="mx-auto space-y-6 p-4 md:p-6 lg:p-8">{children}</div>
          </main>
          <Footer />
          <InstallButton />
        </SidebarInset>
      </TourProvider>
    </SidebarProvider>
  );
```

- [ ] **Step 6: Type-check and build**

Run: `bunx tsc --noEmit && bun run build`
Expected: both succeed. A `useSearchParams` error would mean the Suspense boundary in `app/layout.tsx` was changed — it wraps `BranchProvider`/`ConditionalLayout`, so it must stay.

- [ ] **Step 7: Prove the tour renders, without an account**

The dashboard redirects only in production (`proxy.ts`), but the tour needs a resolved role, so prove the card and the step engine on the existing sandbox page. Temporarily replace the body of `app/(frontend)/(dashboard)/dashboard/test/date/page.tsx` with a throwaway harness (delete this harness in Task 5):

```tsx
"use client";

import { NextStep, NextStepProvider, useNextStep } from "nextstepjs";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/tour/TourCard";
import { buildTours } from "@/lib/tours/tours";

const steps = buildTours({ desktop: true, menuKey: "admin" });

function Start() {
  const { startNextStep } = useNextStep();
  return (
    <Button onClick={() => startNextStep("admin")}>Mulai tur admin</Button>
  );
}

export default function Page() {
  return (
    <NextStepProvider>
      <NextStep steps={steps} cardComponent={TourCard} scrollToTop={false}>
        <div id="sandbox" className="space-y-4 p-8 text-sm">
          <h1 className="text-xl font-semibold">Sandbox tur</h1>
          <p data-slot="sidebar-content">Target sidebar tiruan</p>
          <Start />
        </div>
      </NextStep>
    </NextStepProvider>
  );
}
```

Then drive it in the browser on `http://localhost:8999/dashboard/test/date`: click "Mulai tur admin", and confirm

- the card renders in house style with `Langkah 1 dari 8`, `Lanjut`, `Kembali`, `Lewati`;
- step 1 spotlights the fake `[data-slot="sidebar-content"]` block;
- `Lanjut` moves to step 2 (the header step's selector will not match here, so the card must center — this is the documented no-match behavior from spec §9);
- `Lewati` closes the tour;
- dark mode (toggle `.dark` on `<html>` via devtools) keeps the card legible;
- the console shows no errors.

- [ ] **Step 8: Commit**

```bash
git add lib/tours/useTour.ts components/tour components/ConditionalLayout.tsx app/\(frontend\)/\(dashboard\)/dashboard/test/date/page.tsx
git commit -m "feat: mount per-role onboarding tour on the dashboard shell"
```

---

### Task 5: Full verification with a real account, then cleanup

**Files:**
- Modify: `AGENTS.md` (§Testing)
- Restore: `app/(frontend)/(dashboard)/dashboard/test/date/page.tsx` (the harness from Task 4 goes away)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing new; this task is the evidence.

- [ ] **Step 1: Run the scripted checks**

```bash
bun run lib/tours/tour.check.ts && bunx tsc --noEmit
```

Expected: `tour.check.ts: semua assert lolos` then no TypeScript errors.

- [ ] **Step 2: Walk the tour as a real admin**

Sign in at `http://localhost:8999/auth/sign-in` with the test account, and with `localStorage` cleared first (`localStorage.clear()` in devtools).

Expected, in order:

| Check | Expected |
|---|---|
| Auto-start | Within ~1s of the dashboard rendering, the card appears on its own |
| Step count | Foundation admin (`admin` menu): 8. Admin that selected a branch (`schooladministrator`): 5 |
| Cross-page | `Lanjut` on a page step navigates, and the next card appears once the page settles |
| Back | `Kembali` on a page step returns to the previous page |
| Skip | `Lewati` closes the tour and the page is usable again |
| No repeat | Reload → no auto-start |
| Replay | `Panduan` in the header starts the tour again |
| Mobile | At 390px width the sidebar steps are gone and the opener button is highlighted instead |
| Dark mode | Card, text, and buttons stay legible |
| Console | No errors or React warnings from the tour |

- [ ] **Step 3: Fix what the walkthrough exposes**

Common adjustments, in the order worth trying: raise or lower `scrollOffset` in `ANCHOR` (`lib/tours/tours.ts`) until a top-of-page highlight clears the sticky header; shorten a step's `content` if a card overflows a 390px viewport; if the card covers its own target, set `cardOffset` on that step. Re-run Step 1 after each edit.

- [ ] **Step 4: Record the new check in AGENTS.md**

In `AGENTS.md`, §"Testing & QA" → "Quality Verification Strategy for AI Assistants", item 7 currently documents `bun run lib/rabbitMQ/retry.check.ts`. Append:

```markdown
8. **Onboarding tour self-check**: `bun run lib/tours/tour.check.ts` — `assert`-based, no
   framework. Covers the role→menu→tour mapping, the `localStorage` key shape, and that
   every route a tour navigates to still has a `page.tsx`. Run it after moving or
   deleting a dashboard route.
```

- [ ] **Step 5: Remove the throwaway harness**

Restore `app/(frontend)/(dashboard)/dashboard/test/date/page.tsx` to its committed version:

```bash
git checkout -- "app/(frontend)/(dashboard)/dashboard/test/date/page.tsx"
```

Confirm nothing references the harness:

```bash
grep -rn "Sandbox tur" app components lib || echo "harness gone"
```

- [ ] **Step 6: Final gates**

```bash
bun run lib/tours/tour.check.ts && bunx tsc --noEmit && bun run build
```

Expected: check passes, no TypeScript errors, production build succeeds.

- [ ] **Step 7: Commit**

```bash
git add AGENTS.md "app/(frontend)/(dashboard)/dashboard/test/date/page.tsx"
git commit -m "docs: record onboarding tour self-check"
```

---

## Self-Review

**Spec coverage** — each spec section maps to a task:

| Spec | Task |
|---|---|
| §2 goals 1–5 | Tasks 3 (content), 4 (auto-start + replay), 5 (evidence) |
| §4 architecture | Task 4 Steps 3 and 5 |
| §5 tour content and routes | Task 3 Steps 3–4, asserted in Task 3 Step 1 |
| §6 state and persistence | Task 2 |
| §7 file table | Tasks 1–4 create every listed file; `AGENTS.md` row lands in Task 5 |
| §8 mobile | Task 3 Step 4 (`buildTours({ desktop })`) and Task 5 Step 2 |
| §9 risks | `scrollOffset`/retry options in Task 3; mount-gating in Task 4; `try/catch` in Task 2; route guard in Task 3 |
| §10 verification | Task 5 Step 1–2, plus Task 4 Step 7 for proof without an account |
| §11.1 custom card | Task 4 Step 2 |

**Placeholder scan:** no TBD/TODO; every step carries the code it needs. The one "adjust during verification" instruction (Task 5 Step 3) names the exact constant and the exact symptom, and has a runnable gate behind it.

**Type consistency:** `getRoleMenuKey(role, school?)` is called with two arguments in Task 1 Step 3 and Task 4 Step 1. `TourKey` gates `writeTourDone` in Task 4 Step 3 via `isTourKey`, both defined in Task 2. `buildTours({ desktop, menuKey })` is called identically in Task 3's check, Task 4 Step 3, and Task 4 Step 7. `SELECTORS` / `TOUR_HEADER` / `TOUR_ATTR` are defined in Task 3 Step 3 and used in Task 3 Step 1's assertion and Task 4 Step 5. `Tour` and `Step` come from `nextstepjs` everywhere — no local duplicates.

**Not covered on purpose:** the 3 dead menu URLs, the unused branch `Select` in `appSidebar`, and the landing-page polish (spec §3, §11).
