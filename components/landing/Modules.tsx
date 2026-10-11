/**
 * The module register: seven rows, hairline-separated, in the order a school
 * year actually flows. Not seven identical cards — the row itself is the
 * structure, and the table names on the right are the proof that each row is
 * backed by real records rather than a marketing label.
 */
const MODULES = [
  {
    name: "Akademik",
    body: "Tahun ajaran, kelas, mata pelajaran, dan jadwal pelajaran tersusun sebelum satu pun catatan masuk. Guru membuka jadwalnya, bukan mencari berkas.",
    tables: ["AcademicYear", "Class", "Subject", "Schedule"],
  },
  {
    name: "Presensi",
    body: "Kehadiran dicatat per siswa per jadwal: hadir, sakit, izin, atau alfa. Check-in dan check-out guru tercatat terpisah di hari yang sama.",
    tables: ["Attendance", "TeacherAttendance"],
  },
  {
    name: "Tahfidz Al-Qur'an",
    body: "Setoran hafalan disimpan per surah dengan ayat awal dan ayat akhir serta nilai A–E, sehingga capaian tiap siswa terbaca urut. Daftar surah sudah lengkap: nama Arab, nama latin, jumlah ayat, tempat turun.",
    tables: ["SurahQuran", "TahfidzGroup", "TahfidzRecord"],
  },
  {
    name: "Penilaian & rapor",
    body: "Tipe nilai dikonfigurasi per unit, nilai diinput guru, dan rapor tersusun dari himpunan nilai yang sama — bukan dari rekap terpisah.",
    tables: ["GradeType", "Assignment"],
  },
  {
    name: "Keuangan & SPP",
    body: "Jenis tagihan, rincian komponen, tagihan per siswa, dan rekening kas tiap cabang. Orang tua membayar daring lewat Midtrans, atau bendahara memverifikasi transfer manual.",
    tables: ["PaymentType", "PaymentItems", "Payment", "AccountBank"],
  },
  {
    name: "Kedisiplinan",
    body: "Jenis pelanggaran punya bobot poinnya sendiri, dan setiap pencatatan menambah akumulasi poin siswa yang bisa ditindaklanjuti wali kelas.",
    tables: ["Violation"],
  },
  {
    name: "Pemberitahuan orang tua",
    body: "Ringkasan kehadiran, poin kedisiplinan, dan kuitansi dikirim ke nomor WhatsApp orang tua, tanpa guru menulis satu pesan pun secara manual.",
    tables: ["Notification"],
  },
];

export function Modules() {
  return (
    <section id="fitur" className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Tujuh modul, satu basis data.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Yang membuat administrasi sekolah berat bukan jumlah pekerjaannya,
            tapi pekerjaan yang sama dikerjakan dua kali. Di sini satu catatan
            dipakai ulang oleh seluruh modul di bawahnya.
          </p>
        </div>

        <ul className="border-border mt-14 divide-y border-t">
          {MODULES.map((module) => (
            <li
              key={module.name}
              className="grid gap-3 py-7 md:grid-cols-12 md:gap-8 md:py-8"
            >
              <h3 className="text-foreground text-base font-semibold tracking-tight md:col-span-3">
                {module.name}
              </h3>
              <p className="text-muted-foreground max-w-[62ch] text-sm leading-relaxed md:col-span-6">
                {module.body}
              </p>
              <ul className="flex flex-wrap gap-1.5 md:col-span-3 md:justify-end">
                {module.tables.map((table) => (
                  <li
                    key={table}
                    className="border-border text-muted-foreground rounded-full border px-2.5 py-1 font-mono text-[11px]"
                  >
                    {table}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
