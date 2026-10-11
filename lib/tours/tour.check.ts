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
