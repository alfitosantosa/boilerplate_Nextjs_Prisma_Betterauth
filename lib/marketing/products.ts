import type { LucideIcon } from "lucide-react";
import {
  Baby,
  BookOpen,
  ClipboardList,
  Globe,
  HeartHandshake,
  Library,
  Network,
  QrCode,
  Wallet,
  MonitorCheck,
} from "lucide-react";

/**
 * Sumber tunggal konten marketing: katalog 10 modul, add-on, paket harga, dan
 * pemetaan kemampuan sistem. Dipakai oleh landing `/` dan halaman `/produk/[slug]`.
 *
 * Status jujur per modul: `tersedia` (didukung model data yang ada), `pengembangan`
 * (dalam roadmap), `kustom` (dikerjakan per proyek). Jangan menaikkan status tanpa
 * model pendukungnya di prisma/schema.prisma.
 */

export type ProductStatus = "tersedia" | "pengembangan" | "kustom";

export type Product = {
  slug: string;
  no: string;
  name: string;
  tagline: string;
  description: string;
  target: string;
  status: ProductStatus;
  statusNote?: string;
  included: string;
  features: { title: string; detail: string }[];
  icon: LucideIcon;
};

export const products: Product[] = [
  {
    slug: "siakad",
    no: "01",
    name: "SIAKAD",
    tagline: "Satu catatan untuk semua data akademik",
    description:
      "Manajemen siswa, guru, kelas, jurusan, tahun ajaran, jadwal, nilai, hingga rapor — semuanya tersambung dalam satu sistem, tanpa menyalin ulang dari satu file ke file lain.",
    target: "Kepala sekolah, waka kurikulum, TU",
    status: "tersedia",
    included: "Termasuk di paket Professional ke atas",
    icon: BookOpen,
    features: [
      {
        title: "Data siswa, guru, kelas & jurusan",
        detail:
          "Profil lengkap terpusat; sekali diperbarui, langsung terlihat di presensi, keuangan, dan rapor.",
      },
      {
        title: "Tahun ajaran & semester",
        detail:
          "Setiap nilai, presensi, dan tagihan melekat pada periode yang benar, sehingga riwayat antar tahun tidak tercampur.",
      },
      {
        title: "Jadwal pelajaran",
        detail:
          "Jadwal per kelas dan guru dengan deteksi bentrok, tersusun dari mata pelajaran yang sudah terdaftar.",
      },
      {
        title: "Penilaian dengan skala & konfigurasi",
        detail:
          "Tipe penilaian, skala nilai, dan konfigurasi per jenjang mengikuti aturan sekolah masing-masing.",
      },
      {
        title: "Ujian, nilai akhir & rapor",
        detail:
          "Nilai ujian dan penilaian akhir terkumpul otomatis menjadi rapor bernomor, siap unduh sebagai PDF.",
      },
      {
        title: "Kenaikan kelas & kelulusan",
        detail:
          "Riwayat akademik tiap siswa tersimpan utuh per tahun ajaran, dari masuk sampai lulus.",
      },
    ],
  },
  {
    slug: "presensi-digital",
    no: "02",
    name: "Presensi Digital",
    tagline: "Kehadiran tercatat, orang tua langsung tahu",
    description:
      "Presensi siswa dengan QR/barcode, presensi guru dan staf, rekap hadir–sakit–izin–alfa, dan notifikasi ke orang tua secara otomatis lewat WhatsApp.",
    target: "Kepala sekolah, waka kesiswaan, TU",
    status: "tersedia",
    included: "Presensi dasar di Paket Starter; QR & notifikasi di Professional",
    icon: QrCode,
    features: [
      {
        title: "Presensi siswa per jadwal",
        detail:
          "Status hadir, sakit, izin, dan alfa tercatat langsung pada jadwal pelajaran hari itu.",
      },
      {
        title: "Presensi guru & staf",
        detail:
          "Check-in dan check-out guru dicatat terpisah dari presensi siswa, dengan rekapitulasi sendiri.",
      },
      {
        title: "Rekap otomatis",
        detail:
          "Ringkasan kehadiran per siswa, kelas, dan periode tersusun tanpa merekap manual di akhir bulan.",
      },
      {
        title: "Notifikasi orang tua",
        detail:
          "Kabar kehadiran anak terkirim ke nomor WhatsApp orang tua lewat antrean pengiriman yang andal.",
      },
      {
        title: "Laporan kehadiran",
        detail:
          "Unduh rekap kehadiran dalam PDF atau Excel untuk arsip dan pelaporan dinas.",
      },
    ],
  },
  {
    slug: "keuangan-sekolah",
    no: "03",
    name: "Keuangan & Pembayaran Sekolah",
    tagline: "Tagihan jelas, tunggakan terlihat, kas terkontrol",
    description:
      "SPP dan tagihan otomatis per siswa, pembayaran online via Midtrans atau transfer manual, kuitansi PDF, dan laporan keuangan per cabang sekolah.",
    target: "Bendahara, kepala sekolah, yayasan",
    status: "tersedia",
    included: "Termasuk di paket Professional ke atas",
    icon: Wallet,
    features: [
      {
        title: "Jenis pembayaran fleksibel",
        detail:
          "SPP bulanan, uang pangkal, dan biaya kegiatan dengan nominal sendiri per cabang sekolah.",
      },
      {
        title: "Tagihan otomatis",
        detail:
          "Tagihan tercatat per siswa per bulan; tunggakan dan yang sudah lunas langsung terlihat.",
      },
      {
        title: "Pembayaran online",
        detail:
          "Integrasi Midtrans Snap dan Core API — pembayaran berhasil langsung memperbarui status tagihan.",
      },
      {
        title: "Pembayaran manual & transfer",
        detail:
          "Transfer bank dicatat dengan referensi, tanggal, dan status, lengkap dengan data rekening per cabang.",
      },
      {
        title: "Kuitansi & laporan",
        detail:
          "Kuitansi PDF bernomor diterbitkan dari sistem, dan seluruh aktivitas keuangan memiliki jejak audit.",
      },
    ],
  },
  {
    slug: "portal-orang-tua",
    no: "04",
    name: "Portal Orang Tua & Wali Murid",
    tagline: "Orang tua tahu kabar anak tanpa ditanya",
    description:
      "Pantau absensi, nilai, tagihan, dan pengumuman sekolah dari ponsel — lewat browser biasa atau notifikasi WhatsApp, tanpa memasang aplikasi apa pun.",
    target: "Yayasan dan sekolah yang ingin meningkatkan layanan orang tua",
    status: "tersedia",
    included: "Termasuk di paket Professional ke atas",
    icon: HeartHandshake,
    features: [
      {
        title: "Pantau absensi & nilai",
        detail:
          "Riwayat kehadiran dan nilai anak tampil sesuai data terbaru dari guru.",
      },
      {
        title: "Tagihan & pembayaran",
        detail:
          "Orang tua melihat rincian SPP dan membayar dari portal yang sama.",
      },
      {
        title: "Pengumuman sekolah",
        detail:
          "Informasi resmi sekolah sampai ke orang tua tanpa bergantung pada grup chat.",
      },
      {
        title: "Notifikasi WhatsApp",
        detail:
          "Kabar penting — presensi, tagihan, pengumuman — otomatis ke nomor orang tua.",
      },
      {
        title: "Riwayat perkembangan anak",
        detail:
          "Tugas, poin kedisiplinan, dan capaian hafalan anak terlihat dalam satu riwayat.",
      },
    ],
  },
  {
    slug: "ppdb",
    no: "05",
    name: "PPDB / SPMB Online",
    tagline: "Penerimaan siswa baru tanpa antrean kertas",
    description:
      "Pendaftaran calon siswa online, unggah dokumen, seleksi dan pengumuman, daftar ulang, lalu konversi otomatis menjadi siswa aktif di tahun ajaran baru.",
    target: "Sekolah yang ingin mempermudah penerimaan siswa baru",
    status: "pengembangan",
    statusNote:
      "Blok bangunannya tersedia (verifikasi dokumen, pembayaran daftar ulang, data calon siswa); alur PPDB penuh sedang diselesaikan.",
    included: "Masuk di Paket Complete; dapat menjadi proyek tersendiri",
    icon: ClipboardList,
    features: [
      {
        title: "Pendaftaran online",
        detail:
          "Formulir calon siswa lengkap dengan data orang tua, tanpa datang ke sekolah.",
      },
      {
        title: "Unggah dokumen persyaratan",
        detail:
          "Berkas persyaratan terkumpul digital dan diperiksa status verifikasinya oleh panitia.",
      },
      {
        title: "Seleksi & pengumuman",
        detail:
          "Status seleksi tercatat dan hasilnya diumumkan lewat kanal resmi sekolah.",
      },
      {
        title: "Daftar ulang",
        detail:
          "Pembayaran daftar ulang tercatat sebagai tagihan, bukan transaksi lepas.",
      },
      {
        title: "Konversi siswa aktif",
        detail:
          "Calon yang diterima langsung menjadi siswa terdaftar di kelasnya, tanpa pengetikan ulang.",
      },
    ],
  },
  {
    slug: "website-sekolah",
    no: "06",
    name: "Website Resmi Sekolah",
    tagline: "Wajah sekolah yang profesional di Google",
    description:
      "Profil dan sejarah sekolah, informasi program pendidikan, berita, galeri, pengumuman, halaman pendaftaran, dan formulir kontak calon siswa.",
    target: "Sekolah yang belum punya website profesional atau ingin memperbarui",
    status: "kustom",
    statusNote: "Dikerjakan sebagai proyek kustom per sekolah.",
    included: "Proyek tersendiri — titik masuk paling ringan",
    icon: Globe,
    features: [
      {
        title: "Profil & sejarah sekolah",
        detail:
          "Halaman profil yang menampilkan identitas, visi, misi, dan jejak sekolah.",
      },
      {
        title: "Program pendidikan",
        detail:
          "Informasi jurusan dan program per jenjang, terhubung dengan data yang sama seperti brosur digital.",
      },
      {
        title: "Berita, galeri & pengumuman",
        detail:
          "Konten sekolah dikelola dari sistem dan tampil di website tanpa duplikasi.",
      },
      {
        title: "Halaman pendaftaran",
        detail:
          "Tombol daftar terhubung langsung ke PPDB online sekolah.",
      },
      {
        title: "Kontak & formulir calon siswa",
        detail:
          "Calon orang tua dapat menghubungi sekolah dari satu formulir yang rapi.",
      },
    ],
  },
  {
    slug: "ujian-online-lms",
    no: "07",
    name: "Ujian Online & LMS",
    tagline: "Ujian digital dengan penilaian otomatis",
    description:
      "Bank soal, kode ujian, pilihan ganda dan esai, timer, pengumpulan jawaban, dan hasil yang dinilai otomatis untuk pilihan ganda.",
    target: "Sekolah yang membutuhkan evaluasi digital dan pembelajaran online",
    status: "tersedia",
    included: "Masuk di Paket Complete",
    icon: MonitorCheck,
    features: [
      {
        title: "Bank soal",
        detail:
          "Soal pilihan ganda dan esai tersimpan per mata pelajaran, siap dipakai ulang antar periode.",
      },
      {
        title: "Kode ujian",
        detail:
          "Siswa masuk ujian dengan kode, tanpa perlu membuat akun tambahan.",
      },
      {
        title: "Timer & pengumpulan jawaban",
        detail:
          "Waktu ujian berjalan; jawaban terkumpul otomatis ketika waktu habis.",
      },
      {
        title: "Penilaian otomatis & esai",
        detail:
          "Pilihan ganda dinilai sistem; esai dinilai guru di tempat yang sama.",
      },
      {
        title: "Tugas & pengumpulan",
        detail:
          "Penugasan dengan tenggat waktu dan pengumpulan berkas dari siswa.",
      },
    ],
  },
  {
    slug: "logbook-rapor-anak",
    no: "08",
    name: "Logbook & Rapor Perkembangan Anak",
    tagline: "Perkembangan anak tercatat setiap hari",
    description:
      "Catatan kegiatan harian, dokumentasi foto, capaian perkembangan per kompetensi, catatan guru dan wali kelas, serta rekap untuk rapor TK/PAUD dan SD kelas awal.",
    target: "TK, PAUD, dan SD kelas awal",
    status: "tersedia",
    included: "Masuk di Paket Complete, sesuai jenjang",
    icon: Baby,
    features: [
      {
        title: "Catatan kegiatan harian",
        detail:
          "Kegiatan dan perkembangan tiap anak dicatat langsung pada hari itu.",
      },
      {
        title: "Dokumentasi foto",
        detail:
          "Foto kegiatan menjadi bukti yang menempel pada catatan harian.",
      },
      {
        title: "Area & indikator perkembangan",
        detail:
          "Kompetensi perkembangan terstruktur mengikuti kurikulum yang dipakai sekolah.",
      },
      {
        title: "Observasi guru & wali kelas",
        detail:
          "Catatan pengamatan per kompetensi dari guru dan wali kelas terkumpul rapi.",
      },
      {
        title: "Rekap rapor perkembangan",
        detail:
          "Rangkuman perkembangan menjadi rapor bernomor tanpa menyusun ulang dari awal.",
      },
    ],
  },
  {
    slug: "perpustakaan-inventaris",
    no: "09",
    name: "Perpustakaan Digital & Inventaris",
    tagline: "Buku dan aset sekolah tercatat rapi",
    description:
      "Katalog dan peminjaman buku dengan barcode, data aset dan lokasi barang, peminjaman serta pengembalian inventaris, dan laporan stok serta kondisi aset.",
    target: "Sekolah dengan kebutuhan administrasi aset dan perpustakaan",
    status: "pengembangan",
    included: "Masuk di Paket Complete",
    icon: Library,
    features: [
      {
        title: "Katalog & peminjaman buku",
        detail:
          "Daftar buku dan riwayat pinjam-kembali tercatat per siswa atau guru.",
      },
      {
        title: "Barcode buku",
        detail:
          "Setiap buku diidentifikasi dengan barcode, mempercepat proses pinjam dan kembali.",
      },
      {
        title: "Data aset & lokasi barang",
        detail:
          "Aset sekolah tercatat berikut ruangan penyimpanannya.",
      },
      {
        title: "Pinjam & kembalikan inventaris",
        detail:
          "Alur peminjaman dan pengembalian barang tercatat dengan penanggung jawab.",
      },
      {
        title: "Laporan stok & kondisi aset",
        detail:
          "Stok dan kondisi aset terpantau tanpa inventarisasi ulang dari nol.",
      },
    ],
  },
  {
    slug: "manajemen-yayasan",
    no: "10",
    name: "Sistem Manajemen Yayasan",
    tagline: "Banyak sekolah, satu papan kendali",
    description:
      "Pengelolaan banyak unit sekolah, dashboard konsolidasi, laporan akademik dan keuangan antarunit, manajemen pengguna dan hak akses, serta anggaran, aset, dan audit aktivitas.",
    target: "Yayasan dengan dua atau lebih unit pendidikan",
    status: "tersedia",
    included: "Termasuk di paket Yayasan Enterprise",
    icon: Network,
    features: [
      {
        title: "Multi-unit dalam satu yayasan",
        detail:
          "Setiap sekolah adalah cabang dengan datanya sendiri, di bawah satu yayasan.",
      },
      {
        title: "Dashboard konsolidasi",
        detail:
          "Ringkasan gabungan seluruh unit tampil dalam satu layar.",
      },
      {
        title: "Hak akses lintas unit",
        detail:
          "Peran menentukan siapa melihat apa, dari guru satu kelas sampai pengurus yayasan.",
      },
      {
        title: "Anggaran, aset & audit",
        detail:
          "Jejak aktivitas dan perubahan data tercatat untuk audit dan tata kelola.",
      },
      {
        title: "Laporan antarunit",
        detail:
          "Bandingkan capaian akademik dan keuangan antar sekolah dalam satu laporan.",
      },
    ],
  },
];





export type PricingTier = {
  id: string;
  name: string;
  price: string;
  audience: string;
  model: string;
  features: string[];
  highlighted?: boolean;
};

export const tiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Rp799 ribu/bulan",
    audience: "Sekolah yang baru memulai digitalisasi",
    model: "Per sekolah · per bulan",
    features: [
      "Data siswa, guru dan kelas",
      "Presensi dasar",
      "Jadwal pelajaran",
      "Pengumuman",
      "Laporan dasar",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "Rp899 ribu/bulan",
    audience: "Sekolah yang ingin menyatukan operasional harian",
    model: "Per sekolah · per bulan",
    highlighted: true,
    features: [
      "Semua fitur Starter",
      "Akademik, nilai dan rapor",
      "Keuangan dan tagihan siswa",
      "Portal orang tua",
      "Notifikasi WhatsApp",
      "Dashboard dan laporan PDF/Excel",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    price: "Rp2.999 Juta/bulan",
    audience: "Sekolah yang butuh operasional lebih menyeluruh",
    model: "Per sekolah · per bulan",
    features: [
      "Semua fitur Professional",
      "PPDB/SPMB online",
      "Ujian online dan bank soal",
      "Perpustakaan dan inventaris",
      "BK dan pelanggaran",
      "Logbook dan rapor perkembangan (jika relevan)",
    ],
  },
  {
    id: "enterprise",
    name: "Yayasan Enterprise",
    price: "Rp3.999 Juta/bulan",
    audience: "Yayasan yang mengelola beberapa sekolah",
    model: "Per sekolah · per bulan",
    features: [
      "Multi-unit dan konsolidasi laporan",
      "Hak akses lintas unit",
      "Dashboard yayasan",
      "Anggaran, SDM, dan audit",
      "Migrasi data, pelatihan, dan SLA sesuai kontrak",
    ],
  },
];

export type CapabilityArea = {
  title: string;
  intro: string;
  points: string[];
};

/**
 * Kemampuan sistem yang dijual — diturunkan dari model data yang benar-benar
 * ada, tapi ditulis sebagai fungsi yang dikerjakan untuk sekolah, bukan nama
 * tabel.
 */
export const capabilities: CapabilityArea[] = [
  {
    title: "Akademik & Rapor",
    intro: "Nilai, jadwal, dan rapor tersambung dari satu catatan.",
    points: [
      "Tahun ajaran, semester, kelas, dan jurusan terpusat",
      "Penilaian dengan skala dan konfigurasi per jenjang",
      "Rapor dan laporan siswa bernomor, siap unduh PDF",
    ],
  },
  {
    title: "Presensi & Kehadiran",
    intro: "Hadir, sakit, izin, alfa — tercatat langsung pada jadwal.",
    points: [
      "Presensi siswa per jadwal pelajaran",
      "Check-in guru dan staf terpisah dari siswa",
      "Rekap otomatis + notifikasi WhatsApp ke orang tua",
    ],
  },
  {
    title: "Keuangan & SPP",
    intro: "Dari tagihan sampai audit dalam satu alur.",
    points: [
      "Tagihan otomatis per siswa per bulan",
      "Pembayaran online Midtrans dan transfer manual",
      "Kuitansi PDF dan laporan per cabang sekolah",
    ],
  },
  {
    title: "Komunikasi Sekolah",
    intro: "Pengumuman dan notifikasi sampai ke orang tua.",
    points: [
      "Pengumuman sekolah tersebar dari satu tempat",
      "Notifikasi WhatsApp massal lewat antrean pengiriman",
      "Kalender agenda sekolah untuk semua peran",
    ],
  },
  {
    title: "Tahfidz Al-Qur'an",
    intro: "Setoran hafalan tercatat per surah, per siswa.",
    points: [
      "Katalog surah lengkap: Arab, latin, jumlah ayat",
      "Kelompok tahfidz dengan nilai setoran A–E",
      "Capaian hafalan tiap siswa terlihat urut",
    ],
  },
  {
    title: "Ujian & Tugas",
    intro: "Dari bank soal sampai hasil ujian.",
    points: [
      "Soal pilihan ganda dan esai per mata pelajaran",
      "Ujian dengan kode, timer, dan penilaian otomatis",
      "Tugas dengan tenggat waktu dan pengumpulan",
    ],
  },
  {
    title: "Kedisiplinan Siswa",
    intro: "Pelanggaran tercatat, tindak lanjut terpantau.",
    points: [
      "Jenis pelanggaran dan poin yang terstandar",
      "Riwayat disiplin per siswa",
      "Tindak lanjut oleh wali kelas terdokumentasi",
    ],
  },
  {
    title: "Perkembangan Anak",
    intro: "Untuk TK, PAUD, dan SD kelas awal.",
    points: [
      "Catatan harian dan foto kegiatan",
      "Indikator perkembangan per kompetensi",
      "Rekap perkembangan untuk rapor",
    ],
  },
  {
    title: "Yayasan & Hak Akses",
    intro: "Banyak unit, satu papan kendali.",
    points: [
      "Setiap sekolah adalah cabang dengan data terpisah",
      "Peran menentukan hak akses tiap pengguna",
      "Audit aktivitas dan laporan konsolidasi antarunit",
    ],
  },
];

export type RoadmapStep = {
  title: string;
  detail: string;
};

export const roadmap: RoadmapStep[] = [
  {
    title: "Website sekolah + PPDB online",
    detail:
      "Manfaat paling mudah dijelaskan kepada sekolah yang belum punya pendaftaran digital.",
  },
  {
    title: "Presensi digital + notifikasi WhatsApp",
    detail:
      "Manfaat yang langsung terlihat oleh kepala sekolah dan orang tua.",
  },
  {
    title: "Keuangan sekolah + pembayaran SPP",
    detail:
      "Mengurangi pencatatan manual dan mempermudah pelacakan tunggakan.",
  },
  {
    title: "SIAKAD + rapor",
    detail: "Fondasi penggunaan jangka panjang sekolah.",
  },
  {
    title: "Paket yayasan",
    detail:
      "Ditawarkan setelah kebutuhan nyata untuk konsolidasi beberapa unit muncul.",
  },
];

export const pricingNote =
  "Harga langganan Rp799 ribu per sekolah per bulan, sudah termasuk hosting dan dukungan berkala. Nominal akhir dapat disesuaikan dengan jumlah siswa, migrasi data, dan pelatihan pada saat penawaran.";
