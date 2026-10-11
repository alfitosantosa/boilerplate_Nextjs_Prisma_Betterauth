/**
 * Satu-satunya elemen yang boleh disorot tur, plus nama atribut penandanya.
 * Dikumpulkan di satu berkas supaya perubahan pada shell maupun pada dialog hanya
 * menyentuh satu tempat.
 */
export const TOUR_ATTR = "data-tour";

/** Nilai `data-tour` pada header shell di `components/ConditionalLayout.tsx`. */
export const TOUR_HEADER = "header";

/**
 * Nilai `data-tour` pada tombol "Tambah ..." di halaman master: satu nilai untuk semua
 * halaman, karena hanya satu halaman yang ter-mount pada satu waktu.
 */
export const TOUR_CREATE = "create";

/** Awalan `data-tour` pada isi dialog tambah-data: `dialog:<name>`. */
export const TOUR_DIALOG = "dialog";

/** Awalan `data-tour` pada satu kolom di dalam dialog: `field:<name>`. */
export const TOUR_FIELD = "field";

/** `data-tour` pada tombol simpan di dalam dialog. */
export const TOUR_SUBMIT = "dialog-submit";

/**
 * Nilai `data-tour` pada isi tiap dialog tambah-data.
 *
 * Satu literal per dialog, karena nilai ini harus sama di tiga tempat: atribut di
 * halaman yang memiliki dialognya, penanda `dialog` pada langkah di `tours.ts`, dan
 * pemeriksaan di `tour.check.ts`. `DIALOG_SELECTOR` di bawah adalah bentuk selector dari
 * daftar yang sama, jadi menambah dialog berarti menambah satu baris di sini.
 */
export const TOUR_DIALOG_VALUE = {
  academicYear: `${TOUR_DIALOG}:academicyear`,
  sekolah: `${TOUR_DIALOG}:sekolah`,
  kelas: `${TOUR_DIALOG}:kelas`,
  pengguna: `${TOUR_DIALOG}:pengguna`,
} as const;

export type TourDialogKey = keyof typeof TOUR_DIALOG_VALUE;

/** Nama dialog yang ikut tur, dari daftar di atas — bukan daftar kedua yang bisa basi. */
export const TOUR_DIALOG_KEYS = Object.keys(TOUR_DIALOG_VALUE) as TourDialogKey[];

/** Selector untuk isi tiap dialog tambah-data. */
export const DIALOG_SELECTOR = Object.fromEntries(
  Object.entries(TOUR_DIALOG_VALUE).map(([key, value]) => [
    key,
    `[${TOUR_ATTR}="${value}"]`,
  ]),
) as Record<TourDialogKey, string>;

/**
 * Nilai `data-tour` untuk kolom yang disorot di dalam dialog. Daftarnya sengaja pendek:
 * tur menjelaskan kolom yang menentukan (dan tombol simpannya), bukan setiap kolom —
 * formulir sepuluh kolom menjadi sepuluh langkah kalau semuanya disorot.
 */
export const TOUR_FIELD_VALUE = {
  academicYearName: `${TOUR_FIELD}:tahun-nama`,
  academicYearRange: `${TOUR_FIELD}:tahun-rentang`,
  academicYearActive: `${TOUR_FIELD}:tahun-aktif`,
  sekolahCode: `${TOUR_FIELD}:sekolah-kode`,
  sekolahName: `${TOUR_FIELD}:sekolah-nama`,
  sekolahAdmin: `${TOUR_FIELD}:sekolah-pengelola`,
  kelasName: `${TOUR_FIELD}:kelas-nama`,
  kelasGrade: `${TOUR_FIELD}:kelas-tingkat`,
  kelasBranch: `${TOUR_FIELD}:kelas-sekolah`,
  penggunaName: `${TOUR_FIELD}:pengguna-nama`,
  penggunaEmail: `${TOUR_FIELD}:pengguna-email`,
  penggunaRole: `${TOUR_FIELD}:pengguna-peran`,
} as const;

export type TourFieldKey = keyof typeof TOUR_FIELD_VALUE;

/** Selector untuk tiap kolom yang disorot di dalam dialog. */
export const FIELD_SELECTOR = Object.fromEntries(
  Object.entries(TOUR_FIELD_VALUE).map(([key, value]) => [
    key,
    `[${TOUR_ATTR}="${value}"]`,
  ]),
) as Record<TourFieldKey, string>;

export const SELECTORS = {
  /** Kolom navigasi sidebar yang bisa di-scroll. */
  sidebarNav: '[data-slot="sidebar-content"]',
  /** Blok profil di kaki sidebar. */
  sidebarFooter: '[data-slot="sidebar-footer"]',
  /** Header shell dashboard. */
  header: `[${TOUR_ATTR}="${TOUR_HEADER}"]`,
  /** Tombol pembuka sidebar di bawah `md`, saat sidebar jadi sheet. */
  sidebarTrigger: '[data-slot="sidebar-trigger"]',
  /** Tombol `Tambah ...` di halaman master (Tahun Ajaran, Sekolah, Kelas). */
  createButton: `[${TOUR_ATTR}="${TOUR_CREATE}"]`,
  /** Tombol simpan di dalam dialog tambah-data. */
  submit: `[${TOUR_ATTR}="${TOUR_SUBMIT}"]`,
} as const;
