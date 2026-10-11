"use client";

import { useEffect, useRef } from "react";
import type { CardComponentProps } from "nextstepjs";

import { Button } from "@/components/ui/button";

/**
 * Kartu tur dalam gaya rumah: token warna repo, radius panel, dan Button yang sama
 * dengan sisa aplikasi. nextstepjs menempatkan dan menganimasikan kartu ini; komponen
 * ini hanya mengisi isinya dan mengurus tombolnya.
 *
 * Kartu ini juga harus tetap bisa diklik saat sebuah dialog tambah-data terbuka, dan
 * Radix mempersulit itu dalam mode modal: ia memasang `pointer-events: none` pada
 * `<body>` dan menganggap pointerdown di luar isi dialog sebagai "di luar" — yang
 * menutup dialog. Kartu hidup di luar dialog, jadi:
 *
 *   - `pointer-events-auto` mengembalikan hak klik yang dicabut `<body>`;
 *   - penangkap `pointerdown`/`mousedown` natif milik kartu ini berjalan lebih dulu
 *     daripada listener `document` milik Radix, dan `stopPropagation` di situ membuat
 *     Radix tidak pernah melihat klik tombol Lanjut sebagai klik "di luar".
 *
 * Tanpa keduanya, menekan "Lanjut" pada langkah di dalam dialog menutup formulir yang
 * sedang diisi pengguna.
 */
export function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: CardComponentProps) {
  const root = useRef<HTMLDivElement>(null);
  const isLast = currentStep === totalSteps - 1;

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Radix menutup dialog karena dua jalur, dan keduanya diredam di sini:
    // pointerdown di luar isi dialog, dan fokus yang berpindah ke luar — `onInteractOutside`
    // menghitung focusout juga. `stopPropagation` menutup jalur pertama, `preventDefault`
    // pada mousedown menahan fokus sehingga jalur kedua tidak pernah terjadi.
    const swallowPointer = (event: Event) => event.stopPropagation();
    const holdFocus = (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
    };

    /**
     * Saat dialog Radix terbuka, `<body>` diberi `pointer-events: none` dan overlaynya
     * menutupi layar, sehingga kartu ini tidak lagi bisa di-hit-test walaupun sudah
     * `pointer-events-auto` — dibuktikan di browser: `elementsFromPoint` pada tombol
     * "Lanjut" tidak mengembalikan satu pun elemen kartu, dan klik nyata tidak sampai
     * (Puppeteer menolak: "element may be hidden or covered"). Karena itu pointerdown
     * ditangkap di `document` pada fase capture dan diteruskan sendiri ke tombol kartu
     * yang berada di titik itu.
     *
     * Jalur ini hanya aktif ketika hit testing normal gagal; selama elemen di titik itu
     * masih bagian dari kartu, event dibiarkan lewat supaya browser yang mengurusnya.
     */
    const routeWhenCovered = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const natural = document.elementFromPoint(event.clientX, event.clientY);
      if (natural && el.contains(natural)) return;

      const card = el.getBoundingClientRect();
      const inCard =
        event.clientX >= card.left &&
        event.clientX <= card.right &&
        event.clientY >= card.top &&
        event.clientY <= card.bottom;
      if (!inCard) return;

      const button = [...el.querySelectorAll("button")].find((candidate) => {
        const box = candidate.getBoundingClientRect();
        return (
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom
        );
      });
      if (!button) return;

      event.stopPropagation();
      event.preventDefault();
      button.click();
    };

    el.addEventListener("pointerdown", swallowPointer);
    el.addEventListener("mousedown", holdFocus);
    document.addEventListener("pointerdown", routeWhenCovered, true);
    return () => {
      el.removeEventListener("pointerdown", swallowPointer);
      el.removeEventListener("mousedown", holdFocus);
      document.removeEventListener("pointerdown", routeWhenCovered, true);
    };
  }, []);

  return (
    <div
      ref={root}
      className="border-border bg-card pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-3xl border p-5 shadow-lg"
    >
      <p className="text-muted-foreground text-xs font-medium tabular-nums">
        Langkah {currentStep + 1} dari {totalSteps}
      </p>
      <h2 className="text-foreground mt-2 text-base font-semibold tracking-tight">
        {step.title}
      </h2>
      <div className="text-secondary-foreground mt-2 text-sm leading-relaxed text-pretty">
        {step.content}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={skipTour}
          className="text-muted-foreground"
        >
          Lewati
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Kembali
          </Button>
          <Button type="button" size="sm" onClick={nextStep}>
            {isLast ? "Selesai" : "Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}
