"use client";

import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTourReplay } from "@/lib/tours/useTour";

/** Tombol Panduan di header shell: memutar ulang tur role pengguna. */
export function TourReplayButton() {
  const { replay, canReplay } = useTourReplay();

  if (!canReplay) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={replay}
      className="text-muted-foreground gap-1.5"
    >
      <Compass />
      <span className="hidden sm:inline">Panduan</span>
      <span className="sr-only sm:hidden">Panduan</span>
    </Button>
  );
}
