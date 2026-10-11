import type { Step, Tour } from "nextstepjs";

import { SELECTORS } from "./selectors";
import type { TourKey } from "./tourModel";

/**
 * Rute yang dinavigasi tiap tur. Semuanya sudah diverifikasi punya `page.tsx`; tiga URL
 * di `menuGroups` tidak dipakai karena halamannya tidak ada:
 * `/dashboard/attendance`, `/dashboard/recapattendance`, `/dashboard/recapattendance/class`.
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
export const ALL_TOUR_ROUTES: string[] = Object.values(TOUR_ROUTES).flatMap(
  (routes) => Object.values(routes),
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
  content: "Tombol ini membuka seluruh menu. Isinya mengikuti role akun ini.",
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

/**
 * Di mobile sidebar menjadi sheet, jadi blok profil tidak ada di DOM. Kartu penutupnya
 * dibiarkan tanpa selector: tampil di tengah, tanpa menyorot apa pun yang keliru.
 */
const CLOSING_STEP_MOBILE: Step = {
  title: "Akun Anda",
  content:
    "Profil, ganti akun, dan keluar ada di dalam menu sidebar. Tur ini bisa diputar ulang dari tombol Panduan di header.",
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
    content: "Setelah tahun ajaran ada, susun kelas dan wali kelasnya.",
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
    content: "Satu siswa satu baris: tagihan, pembayaran, dan sisanya.",
  },
];

const TEACHER_PAGES: PageStep[] = [
  {
    route: TOUR_ROUTES.teacher.schedule,
    title: "Jadwal mengajar",
    content: "Jadwal pelajaran pekan ini. Presensi per jam diisi dari sini.",
  },
  {
    route: TOUR_ROUTES.teacher.attendance,
    title: "Presensi kelas",
    content: "Tandai hadir, sakit, izin, atau alfa per siswa per jadwal.",
  },
  {
    route: TOUR_ROUTES.teacher.exam,
    title: "Ujian dan nilai",
    content: "Bank soal, jadwal ujian, dan nilai terkumpul di satu tempat.",
  },
  {
    route: TOUR_ROUTES.teacher.violations,
    title: "Pelanggaran siswa",
    content: "Catat pelanggaran; poinnya terakumulasi per siswa.",
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
  const closing = desktop ? CLOSING_STEP : CLOSING_STEP_MOBILE;
  const adminPages =
    menuKey === "schooladministrator" ? ADMIN_SCHOOL_PAGES : ADMIN_PAGES;

  // nextstepjs berpindah halaman lewat `nextRoute` langkah SEBELUM langkah yang
  // ditampilkan, jadi rute halaman pertama harus menempel pada langkah krom terakhir —
  // tanpa itu kartu halaman pertama tampil di halaman tempat pengguna sedang berada.
  const stepsFor = (pages: PageStep[]): Step[] => [
    ...chrome.map((step, index) =>
      index === chrome.length - 1
        ? { ...step, nextRoute: pages[0].route }
        : step,
    ),
    ...pageSteps(pages),
    closing,
  ];

  return [
    { tour: "admin" satisfies TourKey, steps: stepsFor(adminPages) },
    { tour: "treasurer" satisfies TourKey, steps: stepsFor(TREASURER_PAGES) },
    { tour: "teacher" satisfies TourKey, steps: stepsFor(TEACHER_PAGES) },
    { tour: "student" satisfies TourKey, steps: stepsFor(STUDENT_PAGES) },
    { tour: "parent" satisfies TourKey, steps: stepsFor(PARENT_PAGES) },
  ];
}
