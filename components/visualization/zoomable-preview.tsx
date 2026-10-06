"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomablePreviewProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  minScale?: number;
  maxScale?: number;
  label?: string;
}

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Touch-friendly preview frame: pinch/scroll-zoom, drag-pan, and reset.
 * Keeps wide diagrams usable inside a fixed layout without overflowing the page.
 */
export function ZoomablePreview({
  children,
  className,
  contentClassName,
  minScale = 0.55,
  maxScale = 2.75,
  label = "พรีวิว",
}: ZoomablePreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ distance: number; scale: number; mid: Point; translate: Point } | null>(
    null,
  );
  const dragStart = useRef<{ point: Point; translate: Point } | null>(null);
  const transformRef = useRef({ scale: 1, translate: { x: 0, y: 0 } });

  useEffect(() => {
    transformRef.current = { scale, translate };
  }, [scale, translate]);

  const clampScale = useCallback(
    (value: number) => Math.min(maxScale, Math.max(minScale, value)),
    [maxScale, minScale],
  );

  const reset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const zoomBy = useCallback(
    (delta: number, origin?: Point) => {
      const viewport = viewportRef.current;
      const current = transformRef.current;
      const nextScale = clampScale(current.scale * delta);
      if (nextScale === current.scale) return;

      if (!viewport || !origin) {
        setScale(nextScale);
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const ox = origin.x - rect.left;
      const oy = origin.y - rect.top;
      const ratio = nextScale / current.scale;

      setScale(nextScale);
      setTranslate({
        x: ox - (ox - current.translate.x) * ratio,
        y: oy - (oy - current.translate.y) * ratio,
      });
    },
    [clampScale],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (pointers.current.size === 1) {
      dragStart.current = {
        point,
        translate: { ...transformRef.current.translate },
      };
      pinchStart.current = null;
    }

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      if (!a || !b) return;
      pinchStart.current = {
        distance: distance(a, b),
        scale: transformRef.current.scale,
        mid: midpoint(a, b),
        translate: { ...transformRef.current.translate },
      };
      dragStart.current = null;
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pointers.current.values());
      if (!a || !b) return;

      const currentDistance = distance(a, b);
      if (pinchStart.current.distance < 1) return;

      const nextScale = clampScale(
        pinchStart.current.scale * (currentDistance / pinchStart.current.distance),
      );
      const mid = midpoint(a, b);
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const startMid = pinchStart.current.mid;
      const startOx = startMid.x - rect.left;
      const startOy = startMid.y - rect.top;
      const ox = mid.x - rect.left;
      const oy = mid.y - rect.top;
      const ratio = nextScale / pinchStart.current.scale;

      setScale(nextScale);
      setTranslate({
        x: ox - (startOx - pinchStart.current.translate.x) * ratio,
        y: oy - (startOy - pinchStart.current.translate.y) * ratio,
      });
      return;
    }

    if (pointers.current.size === 1 && dragStart.current) {
      const dx = event.clientX - dragStart.current.point.x;
      const dy = event.clientY - dragStart.current.point.y;
      setTranslate({
        x: dragStart.current.translate.x + dx,
        y: dragStart.current.translate.y + dy,
      });
    }
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
    if (pointers.current.size === 1) {
      const remaining = Array.from(pointers.current.values())[0];
      if (remaining) {
        dragStart.current = {
          point: remaining,
          translate: { ...transformRef.current.translate },
        };
      }
    }
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    zoomBy(factor, { x: event.clientX, y: event.clientY });
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <div
      className={cn(
        "surface-subtle max-w-full min-w-0 overflow-hidden [contain:paint]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2">
        <p className="min-w-0 truncate text-xs text-muted-foreground">
          {label} · ลาก / pinch เพื่อเลื่อน-ซูม
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => zoomBy(0.85)}
            aria-label="ย่อ"
          >
            <Minus className="size-3.5" aria-hidden="true" />
          </Button>
          <span className="min-w-12 text-center font-mono text-xs tabular-nums text-muted-foreground">
            {zoomPercent}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => zoomBy(1.15)}
            aria-label="ขยาย"
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={reset}
            aria-label="รีเซ็ตมุมมอง"
            disabled={scale === 1 && translate.x === 0 && translate.y === 0}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative h-56 max-w-full touch-none select-none overflow-hidden overscroll-contain sm:h-64"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
        role="region"
        aria-label={`${label} ที่ซูมและเลื่อนได้`}
      >
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-max max-w-none will-change-transform",
            contentClassName,
          )}
          style={{
            transform: `translate(calc(-50% + ${translate.x}px), calc(-50% + ${translate.y}px)) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
