/**
 * Self-check untuk logika murni tur onboarding.
 *
 * Jalankan: `bun run lib/tours/tour.check.ts`
 *
 * Sengaja tanpa framework: repo ini belum punya test runner, dan `bun:test` butuh
 * @types/bun (belum terpasang) yang membuat `tsc --noEmit` gagal.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Tour } from "nextstepjs";

import { getRoleMenuKey } from "../ui/roleKey";
import { SELECTORS, TOUR_ATTR, TOUR_CREATE, TOUR_HEADER } from "./selectors";
import { isTourKey, storageKey, tourKeyForMenuKey } from "./tourModel";
import { ALL_TOUR_ROUTES, buildTours, TOUR_ROUTES } from "./tours";

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

// `data-tour` di header dipasang lewat konstanta ini; pastikan tidak tertukar.
assert.equal(SELECTORS.header, `[${TOUR_ATTR}="${TOUR_HEADER}"]`);
assert.equal(SELECTORS.createButton, `[${TOUR_ATTR}="${TOUR_CREATE}"]`);

// Setiap rute yang dipakai tur harus punya page.tsx — kalau tidak, tur menabrak 404.
const pagesDir = fileURLToPath(
  new URL("../../app/(frontend)/(dashboard)", import.meta.url),
);
assert.ok(
  ALL_TOUR_ROUTES.length >= 19,
  `rute tur mengecil tak terduga: ${ALL_TOUR_ROUTES.length}`,
);
for (const route of ALL_TOUR_ROUTES) {
  assert.ok(
    existsSync(join(pagesDir, `${route}/page.tsx`)),
    `rute tur tanpa halaman: ${route}`,
  );
}

// Rantai navigasi MAJU: nextstepjs berpindah halaman lewat `nextRoute` langkah sebelum
// langkah yang ditampilkan, jadi rantai ini harus menyentuh setiap halaman berurutan.
// Assertion `includes` terlalu lemah — bug rute halaman pertama yang tidak pernah
// dinavigasi lolos dari `includes`, jadi yang diperiksa adalah urutannya.
const forwardRoutes = (tour: Tour): string[] =>
  tour.steps
    .map((step) => step.nextRoute)
    .filter((route): route is string => typeof route === "string");
const adminTour = buildTours({ desktop: true, menuKey: "admin" }).find(
  (tour) => tour.tour === "admin",
);
const schoolTour = buildTours({
  desktop: true,
  menuKey: "schooladministrator",
}).find((tour) => tour.tour === "admin");
assert.ok(adminTour);
assert.ok(schoolTour);
assert.deepEqual(forwardRoutes(adminTour), [
  TOUR_ROUTES.admin.academicYear,
  TOUR_ROUTES.admin.branchs,
  TOUR_ROUTES.admin.users,
  TOUR_ROUTES.admin.classes,
  TOUR_ROUTES.admin.attendance,
]);
// Admin sekolah tidak punya menu tingkat yayasan, jadi rantainya lebih pendek.
assert.deepEqual(forwardRoutes(schoolTour), [
  TOUR_ROUTES.admin.classes,
  TOUR_ROUTES.admin.attendance,
]);

// Desktop memakai anchor sidebar; mobile menggantinya dengan tombol pembuka sidebar.
const desktopAdmin = adminTour.steps.map((step) => step.selector);
assert.ok(desktopAdmin.includes(SELECTORS.sidebarNav));
assert.ok(desktopAdmin.includes(SELECTORS.sidebarFooter));
const mobileAdmin = buildTours({ desktop: false, menuKey: "admin" })
  .find((tour) => tour.tour === "admin")!
  .steps.map((step) => step.selector);
assert.ok(mobileAdmin.includes(SELECTORS.sidebarTrigger));
assert.ok(!mobileAdmin.includes(SELECTORS.sidebarNav));
assert.ok(!mobileAdmin.includes(SELECTORS.sidebarFooter));

// Tiga halaman master menyorot tombol buatnya supaya pengguna mengisi satu data pertama.
// Ketiga langkah itu harus memakai sisi `left`: tombolnya ada di kanan, dan `left` adalah
// satu-satunya sisi yang tidak dibalik library demi ruang tepi layar.
const createSteps = adminTour.steps.filter(
  (step) => step.selector === SELECTORS.createButton,
);
assert.deepEqual(
  createSteps.map((step) => step.title),
  ["Mulai dari Tahun Ajaran", "Daftarkan tiap sekolah", "Susun kelas"],
);
for (const step of createSteps) {
  assert.equal(step.side, "left", `sisi salah pada langkah: ${step.title}`);
}
// Di mobile tombol buat sering di luar layar, jadi langkah-langkah itu tanpa selector.
assert.ok(!mobileAdmin.includes(SELECTORS.createButton));

// Tombol buat di berkas halaman harus benar-benar ditandai; selector yang tidak ketemu
// diam-diam berubah jadi kartu tengah, jadi jangan andalkan runtime untuk menangkapnya.
const CREATE_ROUTES = [
  TOUR_ROUTES.admin.academicYear,
  TOUR_ROUTES.admin.branchs,
  TOUR_ROUTES.admin.classes,
];
for (const route of CREATE_ROUTES) {
  const file = join(pagesDir, `${route}/page.tsx`);
  assert.ok(
    readFileSync(file, "utf8").includes("data-tour={TOUR_CREATE}"),
    `tombol buat tanpa data-tour: ${route}`,
  );
}

// Langkah penutup menyorot blok akun dari ATAS: blok itu menempel di dasar viewport, jadi
// kartu di sisi `right`/`left` selalu terpotong tepi bawah (bug yang pernah terjadi).
const closingStep = adminTour.steps[adminTour.steps.length - 1];
assert.equal(closingStep.selector, SELECTORS.sidebarFooter);
assert.equal(closingStep.side, "top-left");

// Lima tur, semua berisi langkah berjudul dan berisi teks.
const semuaTur = buildTours({ desktop: true, menuKey: "student" });
assert.deepEqual(
  semuaTur.map((tour) => tour.tour),
  ["admin", "treasurer", "teacher", "student", "parent"],
);
for (const tour of semuaTur) {
  assert.ok(tour.steps.length > 0, `tur kosong: ${tour.tour}`);
  for (const step of tour.steps) {
    assert.ok(step.title.length > 0, `langkah tanpa judul di ${tour.tour}`);
    assert.ok(
      String(step.content).length > 0,
      `langkah tanpa isi di ${tour.tour}`,
    );
  }
}

console.log("tour.check.ts: semua assert lolos");
