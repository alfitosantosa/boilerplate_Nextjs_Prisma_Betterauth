"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const faqs = [
    {
      q: "Berapa harga pastinya?",
      a: "Nominal pada paket adalah rentang ilustrasi untuk penawaran awal, bukan harga final. Harga akhir ditentukan oleh jumlah siswa, kompleksitas fitur, biaya server, migrasi data, pelatihan, dukungan, dan margin. Setiap sekolah mendapat penawaran tertulis sebelum proyek dimulai.",
    },
    {
      q: "Sekolah kami belum siap SIAKAD lengkap. Bisa mulai dari mana?",
      a: "Bisa mulai dari website sekolah dan PPDB online — manfaatnya paling mudah dijelaskan — atau presensi digital dengan notifikasi WhatsApp yang hasilnya langsung terasa. Nanti bisa dinaikkan ke SIAKAD dan rapor tanpa migrasi ke aplikasi lain, karena datanya sudah di satu platform.",
    },
    {
      q: "Bagaimana data lama dari Excel dipindahkan?",
      a: "Tersedia impor massal dari berkas Excel untuk data master seperti siswa, guru, dan kelas. Berkas diunggah dan dibaca langsung oleh sistem, jadi data lama tidak diketik ulang satu per satu.",
    },
    {
      q: "Apakah ada biaya bulanan?",
      a: "Ya — modelnya berlangganan: Rp799 ribu per sekolah per bulan, sudah termasuk hosting dan dukungan berkala. Paket menentukan cakupan fitur, bukan harga; modul tambahan yang dikerjakan kustom dikenakan biaya sesuai ruang lingkup.",
    },
    {
      q: "Bagaimana pembayaran SPP online bekerja?",
      a: "Setiap jenis pembayaran punya nominalnya sendiri per cabang, dan tagihan tercatat per siswa per bulan. Orang tua bisa membayar daring lewat Midtrans, dan pembayaran yang berhasil langsung memperbarui status tagihan. Transfer manual juga dicatat lengkap dengan referensi banknya, dan kuitansi PDF bernomor diterbitkan dari sistem.",
    },
    {
      q: "Apakah orang tua perlu memasang aplikasi?",
      a: "Tidak. Orang tua memantau absensi, nilai, dan tagihan lewat browser biasa, dan kabar penting dikirim ke nomor WhatsApp mereka. Tidak ada aplikasi yang perlu dipasang.",
    },
    {
      q: "Bagaimana yayasan memantau banyak sekolah?",
      a: "Yayasan terdaftar sebagai satu Foundation, setiap sekolah menjadi cabang dengan datanya sendiri. Pengurus yayasan melihat dashboard konsolidasi dan laporan akademik serta keuangan antarunit, sementara guru dan bendahara tetap bekerja di data cabangnya masing-masing.",
    },
    {
      q: "Bisa menambah modul di tengah jalan?",
      a: "Bisa. Add-on seperti BK dan pelanggaran atau notifikasi WhatsApp ditambahkan setelah modul utama berjalan, tanpa mengubah data yang sudah tercatat.",
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="max-w-[68ch]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Pertanyaan yang muncul sebelum sekolah memutuskan.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[68ch] text-base leading-relaxed">
            Delapan hal yang paling sering ditanyakan kepala sekolah dan
            bendahara: harga, titik mulai, migrasi data, biaya berkala,
            pembayaran SPP, akses orang tua, pemantauan yayasan, dan add-on.
          </p>
        </div>

        <div className="border-border bg-card mt-12 overflow-hidden rounded-3xl border">
          <Accordion type="single" collapsible>
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border-border px-5 md:px-6"
              >
                <AccordionTrigger className="text-foreground hover:text-interactive py-5 text-left text-sm font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-secondary-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
