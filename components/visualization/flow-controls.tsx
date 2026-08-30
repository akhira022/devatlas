"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FlowControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function FlowControls({
  isPlaying,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onPrev,
  onNext,
}: FlowControlsProps) {
  return (
    <div
      className="surface-muted flex flex-wrap items-center justify-between gap-4 px-4 py-3"
      role="group"
      aria-label="ควบคุมการเล่น"
    >
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={currentStep === 0}
        >
          <SkipBack className="size-4" aria-hidden="true" />
          <span className="sr-only">ขั้นตอนก่อนหน้า</span>
        </Button>

        {isPlaying ? (
          <Button variant="outline" size="icon" onClick={onPause}>
            <Pause className="size-4" aria-hidden="true" />
            <span className="sr-only">หยุดชั่วคราว</span>
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={onPlay}>
            <Play className="size-4" aria-hidden="true" />
            <span className="sr-only">เล่น</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
        >
          <SkipForward className="size-4" aria-hidden="true" />
          <span className="sr-only">ขั้นตอนถัดไป</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          <span className="sr-only">เริ่มใหม่</span>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        ขั้นตอน {totalSteps === 0 ? 0 : currentStep + 1}/{totalSteps}
      </p>
    </div>
  );
}
