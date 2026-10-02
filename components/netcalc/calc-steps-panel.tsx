"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalcStep } from "@/lib/netcalc/explain";

interface CalcStepsPanelProps {
  steps: CalcStep[];
  title?: string;
  description?: string;
}

export function CalcStepsPanel({
  steps,
  title = "วิธีคำนวณทีละขั้น",
  description = "ดูค่าที่นำมาใช้ สูตร และการคำนวณ — ปิดผลไว้ก่อนแล้วลองทำเอง แล้วค่อยเปิดเทียบ",
}: CalcStepsPanelProps) {
  const stepsKey = steps.map((step) => `${step.id}:${step.result}`).join("|");
  const [open, setOpen] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [cachedKey, setCachedKey] = useState(stepsKey);

  if (cachedKey !== stepsKey) {
    setCachedKey(stepsKey);
    setRevealed({});
  }

  if (steps.length === 0) return null;

  const allRevealed = steps.every((step) => revealed[step.id]);

  return (
    <Card className="border-emerald-500/25">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle as="h3">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (allRevealed) {
                  setRevealed({});
                } else {
                  const next: Record<string, boolean> = {};
                  for (const step of steps) next[step.id] = true;
                  setRevealed(next);
                }
              }}
            >
              {allRevealed ? (
                <>
                  <EyeOff className="size-3.5" />
                  ซ่อนคำตอบทั้งหมด
                </>
              ) : (
                <>
                  <Eye className="size-3.5" />
                  เปิดคำตอบทั้งหมด
                </>
              )}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
              <ChevronDown
                className={cn("size-4 transition-transform", open && "rotate-180")}
              />
              {open ? "ย่อ" : "ขยาย"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-3">
          <ol className="space-y-3">
            {steps.map((step, index) => {
              const show = Boolean(revealed[step.id]);
              return (
                <li
                  key={step.id}
                  className="rounded-xl border border-border/60 bg-muted/30 p-3 sm:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold">
                      <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {index + 1}
                      </span>
                      {step.title.replace(/^\d+\.\s*/, "")}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        setRevealed((current) => ({
                          ...current,
                          [step.id]: !current[step.id],
                        }))
                      }
                    >
                      {show ? "ซ่อนคำตอบ" : "ดูคำตอบขั้นนี้"}
                    </Button>
                  </div>

                  <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    สูตร: {step.formula}
                  </p>

                  <div className="mt-2">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      ค่าที่นำมาใช้
                    </p>
                    <ul className="mt-1 space-y-0.5 font-mono text-xs sm:text-sm">
                      {step.inputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {show ? (
                    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        วิธีคิด
                      </p>
                      <ul className="space-y-1 font-mono text-xs leading-relaxed sm:text-sm">
                        {step.work.map((line) => (
                          <li key={line} className="break-all text-foreground/90">
                            {line}
                          </li>
                        ))}
                      </ul>
                      <p className="rounded-lg bg-emerald-500/10 px-2.5 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                        ได้: {step.result}
                      </p>
                      {step.tip && (
                        <p className="text-xs text-muted-foreground">เคล็ดลับ: {step.tip}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed border-border/70 px-2.5 py-2 text-xs text-muted-foreground">
                      ลองคำนวณเองก่อน แล้วกด «ดูคำตอบขั้นนี้»
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </CardContent>
      )}
    </Card>
  );
}
