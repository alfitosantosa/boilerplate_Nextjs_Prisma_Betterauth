"use client";

import type { CardComponentProps } from "nextstepjs";

import { Button } from "@/components/ui/button";

/**
 * Kartu tur dalam gaya rumah: token warna repo, radius panel, dan Button yang sama
 * dengan sisa aplikasi. nextstepjs menempatkan dan menganimasikan kartu ini; komponen
 * ini hanya mengisi isinya dan mengurus tombolnya.
 */
export function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: CardComponentProps) {
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="border-border bg-card w-[min(22rem,calc(100vw-2rem))] rounded-3xl border p-5 shadow-lg">
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
