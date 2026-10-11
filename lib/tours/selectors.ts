/**
 * Satu-satunya elemen yang boleh disorot tur, plus nama atribut penandanya.
 * Dikumpulkan di satu berkas supaya perubahan pada shell hanya menyentuh satu tempat.
 */
export const TOUR_ATTR = "data-tour";

/** Nilai `data-tour` pada header shell di `components/ConditionalLayout.tsx`. */
export const TOUR_HEADER = "header";

/**
 * Nilai `data-tour` pada tombol "Tambah ..." di halaman master: satu nilai untuk semua
 * halaman, karena hanya satu halaman yang ter-mount pada satu waktu.
 */
export const TOUR_CREATE = "create";

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
} as const;
