import { HeroCharts } from "./HeroCharts";

/**
 * The section the research says decides the purchase: the yayasan cannot get a
 * fast, accurate recap today, so it cannot act. This answers with the three
 * questions a foundation asks at the end of a month, and the charts behind them.
 *
 * The charts read the same illustrative register figures as the hero, and the
 * note says so. No figure on this page is invented for effect.
 */
const QUESTIONS = [
  {
    q: "Unit mana yang tunggakannya naik bulan ini?",
    a: "Tagihan tercatat per siswa per bulan dengan status dan tanggal jatuh tempo, dan rekening kas dipisah per cabang — jadi kenaikan di satu unit tidak tersembunyi di dalam total yayasan.",
  },
  {
    q: "Mapel mana yang kehadirannya paling turun?",
    a: "Presensi tersimpan per siswa per jadwal, bukan satu angka per hari. Penurunan bisa dilacak sampai jam pelajaran dan gurunya.",
  },
  {
    q: "Guru mana yang belum mengisi jurnalnya?",
    a: "Jadwal, presensi, dan setoran tahfidz punya waktu simpannya sendiri, sehingga yang kosong terlihat sebagai kosong, bukan tertunda.",
  },
];

const presensi = [
  { mark: "H" as const, count: 4 },
  { mark: "S" as const, count: 1 },
  { mark: "I" as const, count: 1 },
  { mark: "A" as const, count: 0 },
];

const spp = [
  { nama: "Ahmad", spp: 450000, status: "LUNAS" as const },
  { nama: "Nabila", spp: 375000, status: "LUNAS" as const },
  { nama: "Hafizh", spp: 500000, status: "LUNAS" as const },
  { nama: "Salsabila", spp: 425000, status: "MENUNGGU" as const },
  { nama: "Ibrahim", spp: 300000, status: "TUNGGAKAN" as const },
  { nama: "Khadijah", spp: 475000, status: "LUNAS" as const },
];

export function Reports() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Yayasan berhenti menunggu rekap.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Selama rekap disusun manual, keputusan menunggu berhari-hari. Tiga
            pertanyaan yang paling sering ditanyakan pengurus di akhir bulan
            bisa dijawab langsung dari catatan yang sudah ada.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <ol className="divide-border min-w-0 divide-y lg:col-span-6">
            {QUESTIONS.map((item) => (
              <li key={item.q} className="py-6 first:pt-0">
                <p className="text-foreground text-base font-medium tracking-tight">
                  {item.q}
                </p>
                <p className="text-muted-foreground mt-2 max-w-[58ch] text-sm leading-relaxed">
                  {item.a}
                </p>
              </li>
            ))}
          </ol>

          <div className="min-w-0 lg:col-span-6">
            <div className="border-border bg-card min-w-0 overflow-hidden rounded-3xl border">
              <div className="border-border text-muted-foreground border-b px-4 py-3 text-xs">
                Rekap pekan ini · contoh tampilan
              </div>
              <HeroCharts presensi={presensi} spp={spp} />
            </div>
            <p className="text-muted-foreground mt-3 max-w-[58ch] text-xs">
              Angka pada grafik adalah ilustrasi dari register contoh di atas,
              bukan data sekolah yang sebenarnya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
