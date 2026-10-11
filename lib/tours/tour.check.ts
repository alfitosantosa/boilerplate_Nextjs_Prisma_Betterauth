/**
 * Self-check untuk logika murni tur onboarding.
 *
 * Jalankan: `bun run lib/tours/tour.check.ts`
 *
 * Sengaja tanpa framework: repo ini belum punya test runner, dan `bun:test` butuh
 * @types/bun (belum terpasang) yang membuat `tsc --noEmit` gagal.
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Tour } from "nextstepjs";

import { getRoleMenuKey } from "../ui/roleKey";
import { SELECTORS, TOUR_ATTR, TOUR_HEADER } from "./selectors";
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

// Tur admin: langkah tingkat yayasan hanya untuk menuKey admin, bukan schooladministrator.
const routesOf = (tour: Tour): string[] =>
  tour.steps.flatMap((step) =>
    [step.nextRoute, step.prevRoute].filter(
      (route): route is string => typeof route === "string",
    ),
  );
const adminTour = buildTours({ desktop: true, menuKey: "admin" }).find(
  (tour) => tour.tour === "admin",
);
const schoolTour = buildTours({
  desktop: true,
  menuKey: "schooladministrator",
}).find((tour) => tour.tour === "admin");
assert.ok(adminTour);
assert.ok(schoolTour);
assert.ok(routesOf(adminTour).includes(TOUR_ROUTES.admin.academicYear));
assert.ok(!routesOf(schoolTour).includes(TOUR_ROUTES.admin.academicYear));
assert.ok(routesOf(schoolTour).includes(TOUR_ROUTES.admin.attendance));

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
