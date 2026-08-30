"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

import {
  ACCENT_COLORS,
  type ProtocolPulse,
} from "@/lib/network/protocol-pulses";
import { cn } from "@/lib/utils";

function Endpoint({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-1.5">
      <div
        className="relative flex size-9 items-center justify-center rounded-md border"
        style={{
          borderColor: `${color}55`,
          backgroundColor: `${color}14`,
        }}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className="block size-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="block h-0.5 w-3 rounded-full"
            style={{ backgroundColor: `${color}99` }}
          />
          <span
            className="block h-0.5 w-3 rounded-full"
            style={{ backgroundColor: `${color}66` }}
          />
        </div>
      </div>
      <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

function Dot({ color, glow }: { color: string; glow: string }) {
  return (
    <span
      className="block size-2.5 rounded-full"
      style={{ backgroundColor: color, boxShadow: glow }}
    />
  );
}

function SceneHttp({ color, glow, reduced }: { color: string; glow: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>
          200 OK
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute top-[18%] left-[58%] text-[10px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.42, 0.5, 0.72, 0.9] }}
      >
        200 OK
      </motion.span>
    </div>
  );
}

function SceneTcp({ color, glow, reduced }: { color: string; glow: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>
          SYN-ACK
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%", "78%", "8%"] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.22, 0.44, 0.66, 0.88],
        }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute top-[16%] left-1/2 -translate-x-1/2 text-[10px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.18, 0.28, 0.48, 0.58, 1] }}
      >
        SYN-ACK
      </motion.span>
    </div>
  );
}

function SceneUdp({ color, glow, reduced }: { color: string; glow: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>
          NO ACK
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {[0, 0.28, 0.56].map((delay) => (
        <motion.div
          key={delay}
          className="absolute top-1/2 left-0 -translate-y-1/2"
          animate={{ left: ["8%", "82%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "linear",
            delay,
            repeatDelay: 0.8,
            times: [0, 0.12, 0.85, 1],
          }}
        >
          <Dot color={color} glow={glow} />
        </motion.div>
      ))}
      <span
        className="absolute bottom-[10%] left-[12%] text-[10px] font-bold tracking-wide"
        style={{ color }}
      >
        NO ACK
      </span>
    </div>
  );
}

function SceneTls({ color, soft, reduced }: { color: string; soft: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-center">
      <motion.div
        className="flex size-8 items-center justify-center rounded-full border"
        style={{ borderColor: `${color}66`, backgroundColor: soft, color }}
        animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lock className="size-3.5" />
      </motion.div>
      <motion.span
        className="absolute bottom-[8%] text-[9px] font-bold tracking-wider"
        style={{ color }}
        animate={reduced ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        SECURE SESSION
      </motion.span>
    </div>
  );
}

function SceneDns({ color, glow, reduced }: { color: string; glow: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="font-mono text-[10px] font-semibold" style={{ color }}>
          93.184.216.34
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.35, 0.48, 0.82, 1] }}
      >
        93.184.216.34
      </motion.span>
    </div>
  );
}

function SceneDhcp({ color, glow, reduced }: { color: string; glow: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>
          ACK
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <Dot color={color} glow={glow} />
          <motion.span
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold"
            style={{ color }}
            animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
            transition={{ duration: 2.7, repeat: Infinity, times: [0, 0.38, 0.48, 0.7, 0.82, 1] }}
          >
            ACK
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}

function SceneSmtp({ color, reduced }: { color: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center" style={{ color }}>
        <Mail className="size-4" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{ color }}
        animate={{ left: ["8%", "78%"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.12, 0.82, 1],
          repeatDelay: 0.3,
        }}
      >
        <Mail className="size-4 drop-shadow-[0_0_6px_currentColor]" />
      </motion.div>
    </div>
  );
}

function SceneImap({ color, reduced }: { color: string; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center gap-2" style={{ color }}>
        <Mail className="size-3.5" />
        <Mail className="size-3.5" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {[0, 0.55].map((delay, index) => (
        <motion.div
          key={delay}
          className="absolute top-1/2 left-0 -translate-y-1/2"
          style={{ color }}
          animate={
            index === 0
              ? { left: ["78%", "8%"], opacity: [0, 1, 1, 0] }
              : { left: ["8%", "78%"], opacity: [0, 1, 1, 0] }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
            repeatDelay: 0.5,
            times: [0, 0.15, 0.8, 1],
          }}
        >
          <Mail className="size-3.5 drop-shadow-[0_0_6px_currentColor]" />
        </motion.div>
      ))}
    </div>
  );
}

function PulseScene({ pulse, reduced }: { pulse: ProtocolPulse; reduced: boolean }) {
  const accent = ACCENT_COLORS[pulse.accent];

  switch (pulse.id) {
    case "http":
      return <SceneHttp color={accent.solid} glow={accent.glow} reduced={reduced} />;
    case "tcp":
      return <SceneTcp color={accent.solid} glow={accent.glow} reduced={reduced} />;
    case "udp":
      return <SceneUdp color={accent.solid} glow={accent.glow} reduced={reduced} />;
    case "tls":
      return <SceneTls color={accent.solid} soft={accent.soft} reduced={reduced} />;
    case "dns":
      return <SceneDns color={accent.solid} glow={accent.glow} reduced={reduced} />;
    case "dhcp":
      return <SceneDhcp color={accent.solid} glow={accent.glow} reduced={reduced} />;
    case "smtp":
      return <SceneSmtp color={accent.solid} reduced={reduced} />;
    case "imap":
      return <SceneImap color={accent.solid} reduced={reduced} />;
  }
}

interface ProtocolPulseCardProps {
  pulse: ProtocolPulse;
  className?: string;
}

export function ProtocolPulseCard({ pulse, className }: ProtocolPulseCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const accent = ACCENT_COLORS[pulse.accent];

  return (
    <Link
      href={pulse.href}
      className={cn(
        "group block rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors",
        "hover:border-primary/35 hover:bg-accent/40 dark:hover:bg-accent/20",
        className,
      )}
    >
      <div className="mb-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {pulse.title}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{pulse.subtitle}</p>
        <div
          className="mt-2 h-0.5 w-10 rounded-full"
          style={{ backgroundColor: accent.solid }}
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 px-2 py-3 dark:bg-[#0b1220]/55">
        <Endpoint label="Client" color={accent.solid} />
        <div className="relative mx-1 h-14 min-w-0 flex-1">
          <div
            className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2"
            style={{ backgroundColor: `${accent.solid}33` }}
          />
          <PulseScene pulse={pulse} reduced={reduced} />
        </div>
        <Endpoint label="Server" color={accent.solid} />
      </div>
    </Link>
  );
}
