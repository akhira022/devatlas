"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

interface SidebarScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarScrollArea({ children, className }: SidebarScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;
    event.stopPropagation();
  };

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4", className)}
    >
      {children}
    </div>
  );
}
