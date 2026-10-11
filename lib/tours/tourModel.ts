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
