"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNextStep, type Step, type Tour } from "nextstepjs";

import { DIALOG_SELECTOR, type TourDialogKey } from "@/lib/tours/selectors";
import type { DialogStep } from "@/lib/tours/tours";

/** Blok langkah milik satu dialog; indeksnya berurutan di dalam daftar langkah. */
type Block = { dialog: TourDialogKey; first: number; last: number };

function blocksOf(steps: Step[]): Block[] {
  const blocks: Block[] = [];
  steps.forEach((step, index) => {
    const dialog = (step as DialogStep).dialog;
    if (!dialog) return;
    const open = blocks.at(-1);
    if (open?.dialog === dialog) open.last = index;
    else blocks.push({ dialog, first: index, last: index });
  });
  return blocks;
}

/**
 * Memindahkan tur ke dalam dialog tambah-data.
 *
 * nextstepjs tidak punya aksi "buka dialog", dan setiap dialog di repo ini menyimpan
 * status bukanya di `useState` halamannya — tidak ada satu pun yang bisa dibuka dari luar
 * komponennya. Jadi arahnya dibalik: pengguna menekan tombol Tambah yang sudah disorot
 * tur, lalu komponen ini melihat dialognya muncul di DOM dan memindahkan tur ke langkah
 * pertama milik dialog itu. Saat dialognya ditutup, sisa blok itu dilewati.
 *
 * Dua sinkronisasi, satu arah masing-masing:
 *   - dialog muncul  -> dari langkah tombol Tambah ke langkah pertama di dalam dialog
 *   - dialog hilang  -> lewati sisa blok, lanjut ke halaman berikutnya
 * Langkah dialog yang tampil sementara dialognya tertutup (pengguna menekan "Lanjut"
 * dari langkah tombol Tambah) juga dilewati, bukan ditampilkan tanpa sorotan.
 */
export function TourDialogSync({ tours }: { tours: Tour[] }) {
  const { currentStep, currentTour, setCurrentStep, isNextStepVisible } =
    useNextStep();

  const blocksByTour = useMemo(
    () =>
      Object.fromEntries(
        tours.map((tour) => [tour.tour, blocksOf(tour.steps)]),
      ) as Record<string, Block[]>,
    [tours],
  );

  // Observer dipasang sekali; nilai yang berubah dibaca lewat ref supaya tidak dipasang
  // ulang setiap langkah berpindah.
  const live = useRef({ currentStep, currentTour, visible: isNextStepVisible });
  live.current = { currentStep, currentTour, visible: isNextStepVisible };

  const sync = useCallback(() => {
    const { currentStep: step, currentTour: tour, visible } = live.current;
    if (!visible || !tour) return;

    const blocks = blocksByTour[tour] ?? [];
    if (blocks.length === 0) return;

    const openDialog = blocks.find((block) =>
      document.querySelector(DIALOG_SELECTOR[block.dialog]),
    );
    if (openDialog) {
      if (step === openDialog.first - 1) setCurrentStep(openDialog.first);
      return;
    }

    const current = blocks.find(
      (block) => step >= block.first && step <= block.last,
    );
    if (current) setCurrentStep(current.last + 1);
  }, [blocksByTour, setCurrentStep]);

  useEffect(() => {
    let frame = 0;
    const observer = new MutationObserver((mutations) => {
      const changed = mutations.some(
        (mutation) =>
          mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0,
      );
      if (!changed || frame) return;
      // Portal Radix dan render tabel sama-sama memicu mutasi; satu sinkronisasi per
      // frame sudah cukup untuk keduanya.
      frame = requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sync]);

  useEffect(() => {
    sync();
  }, [sync, currentStep, isNextStepVisible]);

  return null;
}
