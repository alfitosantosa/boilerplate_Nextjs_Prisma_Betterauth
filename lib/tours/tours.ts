import type { Step, Tour } from "nextstepjs";

import { FIELD_SELECTOR, SELECTORS, type TourDialogKey } from "./selectors";
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
  // Header dashboard sticky hasil ukur di browser: 121px. Tanpa ini sorotan di dekat tepi
  // atas tertutup header; 136 = 121 + jeda 15px.
  scrollOffset: 136,
  // Halaman merender setelah query-nya selesai.
  selectorRetryAttempts: 3,
  selectorRetryDelay: 250,
} as const;

/**
 * Langkah halaman: kartunya tampil di tengah dan `nextRoute` yang memindahkan pengguna.
 * 19 dari 20 halaman yang dikunjungi tidak punya judul level halaman, jadi anchor per
 * halaman akan rapuh; nextstepjs juga tidak punya fallback selector — selector yang tidak
 * ketemu berakhir sebagai kartu tengah, persis seperti ini.
 *
 * Halaman yang punya tombol buat (`data-tour="create"`) boleh menunjuk tombolnya, supaya
 * pengguna tahu apa yang harus diklik untuk mengisi data pertama. Kalau halaman itu juga
 * punya `dialog`, langkahnya berlanjut ke dalam dialog yang terbuka setelah tombol itu
 * ditekan — `TourDialogSync` yang memindahkannya.
 */
type DialogFieldStep = {
  title: string;
  content: string;
  selector: string;
  side?: Step["side"];
};

type PageStep = {
  route: string;
  title: string;
  content: string;
  selector?: string;
  side?: Step["side"];
  /** Langkah yang berjalan di dalam dialog tambah-data halaman ini. */
  dialog?: { name: TourDialogKey; fields: DialogFieldStep[] };
};

/**
 * `Step` dengan penanda dialog: `dialog` memberi tahu `TourDialogSync` bahwa langkah ini
 * hanya berlaku selama dialog itu terbuka. nextstepjs mengabaikan kolom yang tidak
 * dikenalnya, jadi penanda ini tidak menuntut perubahan apa pun di library.
 */
export type DialogStep = Step & { dialog?: TourDialogKey };

function pageSteps(pages: PageStep[], desktop: boolean): Step[] {
  const steps: DialogStep[] = [];

  pages.forEach((page, index) => {
    const nextRoute = index < pages.length - 1 ? pages[index + 1].route : null;
    const prevRoute = index > 0 ? pages[index - 1].route : null;
    // Blok dialog hanya jalan di desktop, sama seperti sorotan tombolnya: di mobile
    // formulir sering lebih tinggi dari layar dan tombol simpannya di luar pandangan.
    const fields = desktop ? (page.dialog?.fields ?? []) : [];

    steps.push({
      title: page.title,
      content: page.content,
      // Langkah terakhir tidak mengarahkan apa-apa: langkah penutup ada di sidebar.
      // Kalau halaman ini punya blok dialog, tongkatnya diserahkan ke langkah pertama di
      // dalam dialog, bukan ke halaman berikutnya.
      ...(nextRoute && fields.length === 0 ? { nextRoute } : {}),
      ...(prevRoute ? { prevRoute } : {}),
      // Sorotan tombol buat hanya di desktop: di mobile tombol itu sering berada di luar
      // layar, dan kartu yang menempel padanya ikut keluar layar.
      ...(desktop && page.selector
        ? { selector: page.selector, side: page.side, ...ANCHOR }
        : {}),
    });

    fields.forEach((field, fieldIndex) => {
      steps.push({
        title: field.title,
        content: field.content,
        selector: field.selector,
        ...(field.side ? { side: field.side } : {}),
        ...ANCHOR,
        ...(page.dialog ? { dialog: page.dialog.name } : {}),
        ...(fieldIndex === fields.length - 1 && nextRoute ? { nextRoute } : {}),
      });
    });
  });

  return steps;
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
  // Tombolnya di tepi kiri header: sisi `bottom` memusatkan kartu selebar layar pada
  // tombol 44px, dan separuh kartunya keluar layar. `bottom-left` membuatnya mulai di
  // tepi kiri tombol, seperti blok akun di langkah penutup.
  side: "bottom-left",
  ...ANCHOR,
};

const CLOSING_STEP: Step = {
  title: "Akun Anda",
  content:
    "Profil, ganti akun, dan keluar ada di sini. Tur ini bisa diputar ulang dari tombol Panduan.",
  selector: SELECTORS.sidebarFooter,
  // Kartu ditaruh DI ATAS blok akun, bukan di sampingnya. Blok akun menempel di dasar
  // viewport, dan nextstepjs memusatkan kartu pada titik sorot: sisi `right` membuat 60px
  // bawah kartu (baris tombolnya) keluar layar, `right-bottom` malah dibalik library ke
  // `right-top` karena ruang bawah dianggap sempit. `top-left` satu-satunya sisi yang
  // tidak pernah dibalik dan tidak menyisakan kartu terpotong.
  side: "top-left",
  ...ANCHOR,
  // Blok akun menempel di tepi kiri layar; padding sorot 8px membuat kotaknya mulai di
  // x=-4, dan kartu `top-left` ikut mulai di situ — 4px sisi kirinya terpotong.
  pointerPadding: 0,
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
      "Buat satu tahun ajaran dulu lewat tombol Tambah Tahun Ajaran. Kelas, jadwal, dan tagihan menempel ke tahun ajaran yang aktif.",
    selector: SELECTORS.createButton,
    side: "left",
    dialog: {
      name: "academicYear",
      fields: [
        {
          title: "Isi nama tahun ajaran",
          content:
            "Tulis dengan pola tahun/tahun, misal 2025/2026. Nama inilah yang muncul di setiap rapor dan tagihan.",
          selector: FIELD_SELECTOR.academicYearName,
          side: "right",
        },
        {
          title: "Tentukan rentang tanggal",
          content:
            "Tanggal mulai dan tanggal selesai menentukan periode yang dihitung di rapor dan tagihan. Isi keduanya, jangan hanya tanggal mulai.",
          selector: FIELD_SELECTOR.academicYearRange,
          side: "right",
        },
        {
          title: "Nyalakan status Aktif",
          content:
            "Tahun ajaran yang aktif jadi acuan halaman lain: kelas, jadwal, dan tagihan mengambil tahun berjalan dari sini.",
          selector: FIELD_SELECTOR.academicYearActive,
          side: "right",
        },
        {
          title: "Simpan",
          content:
            "Tekan Simpan. Tahun ajaran langsung masuk daftar dan bisa dipilih saat membuat kelas.",
          selector: SELECTORS.submit,
          side: "top",
        },
      ],
    },
  },
  {
    route: TOUR_ROUTES.admin.branchs,
    title: "Daftarkan tiap sekolah",
    content:
      "Tambah Sekolah mendaftarkan SMP, SMA, dan SMK IT sebagai cabang. Data antar cabang terpisah, termasuk rekening kasnya.",
    selector: SELECTORS.createButton,
    side: "left",
    dialog: {
      name: "sekolah",
      fields: [
        {
          title: "Kode sekolah",
          content:
            "Kode jadi penanda unik tiap unit, misal SMAIT001. Isi sekali dan jangan diubah setelah dipakai, karena kode ikut tercetak di kuitansi.",
          selector: FIELD_SELECTOR.sekolahCode,
          side: "right",
        },
        {
          title: "Nama sekolah",
          content:
            "Nama unit ini yang tampil di menu, laporan yayasan, dan tagihan yang dilihat orang tua.",
          selector: FIELD_SELECTOR.sekolahName,
          side: "right",
        },
        {
          title: "Pengelola unit",
          content:
            "Nama pengelola atau bendahara unit — orang yang dihubungi orang tua soal pembayaran. Kolom lain seperti alamat dan telepon sifatnya opsional.",
          selector: FIELD_SELECTOR.sekolahAdmin,
          side: "right",
        },
        {
          title: "Simpan, lalu ulangi per jenjang",
          content:
            "Simpan unit pertama. Ulangi langkah yang sama untuk setiap jenjang: SMP, SMA, dan SMK IT.",
          selector: SELECTORS.submit,
          side: "top",
        },
      ],
    },
  },
  {
    route: TOUR_ROUTES.admin.users,
    title: "Undang guru, siswa, dan orang tua",
    content:
      "Akun dibuat lewat tombol Tambah User. Pengguna hanya melihat data cabangnya sendiri.",
    selector: SELECTORS.createButton,
    side: "left",
    dialog: {
      name: "pengguna",
      fields: [
        {
          title: "Nama lengkap",
          content:
            "Isi nama seperti tercatat di sekolah — nama ini yang muncul di daftar pengguna dan di laporan.",
          selector: FIELD_SELECTOR.penggunaName,
          side: "right",
        },
        {
          title: "Email",
          content:
            "Email dipakai pengguna untuk masuk dan menerima kuitansi. Pastikan penulisannya benar sebelum disimpan.",
          selector: FIELD_SELECTOR.penggunaEmail,
          side: "right",
        },
        {
          title: "Peran menentukan sisanya",
          content:
            "Pilih peran lebih dulu: siswa, guru, bendahara, atau orang tua. Kolom di bawahnya menyesuaikan peran yang dipilih — siswa akan diminta NISN dan kelas, guru diminta NIP dan posisi.",
          selector: FIELD_SELECTOR.penggunaRole,
          side: "right",
        },
        {
          title: "Simpan akun",
          content:
            "Tekan Simpan. Akun aktif di cabang yang dipilih, dengan hak akses mengikuti perannya.",
          selector: SELECTORS.submit,
          side: "top",
        },
      ],
    },
  },
  {
    route: TOUR_ROUTES.admin.classes,
    title: "Susun kelas",
    content:
      "Setelah tahun ajaran ada, buat satu kelas lewat tombol Tambah Kelas, lalu tunjuk wali kelasnya.",
    selector: SELECTORS.createButton,
    side: "left",
    dialog: {
      name: "kelas",
      fields: [
        {
          title: "Nama kelas",
          content:
            "Tulis nama kelas seperti yang muncul di jadwal, misal X IPA 1 atau VII-A.",
          selector: FIELD_SELECTOR.kelasName,
          side: "right",
        },
        {
          title: "Tingkat",
          content: "Tingkat diisi angka saja: 10, 11, atau 12.",
          selector: FIELD_SELECTOR.kelasGrade,
          side: "right",
        },
        {
          title: "Sekolah pemilik kelas",
          content:
            "Pilih cabang pemilik kelas ini. Pilihannya hanya cabang yang sudah didaftarkan, jadi daftarkan sekolahnya lebih dulu.",
          selector: FIELD_SELECTOR.kelasBranch,
          side: "right",
        },
        {
          title: "Simpan kelas",
          content:
            "Tekan Simpan. Kelas siap dipakai untuk jadwal, presensi, dan tagihan.",
          selector: SELECTORS.submit,
          side: "top",
        },
      ],
    },
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
    ...pageSteps(pages, desktop),
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
