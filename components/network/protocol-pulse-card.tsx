"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

import {
  ACCENT_COLORS,
  type ProtocolPulse,
  type ProtocolPulseScene,
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

function StaticLabel({ color, children }: { color: string; children: string }) {
  return (
    <div className="relative flex h-full items-center justify-center px-1 text-center">
      <span className="text-[10px] font-bold" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

function SceneRoundtrip({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

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
        className="absolute top-[18%] left-[52%] max-w-[48%] truncate text-[10px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.42, 0.5, 0.72, 1] }}
      >
        {label}
      </motion.span>
    </div>
  );
}

function SceneHandshake({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%", "78%", "8%"] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
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
        {label}
      </motion.span>
    </div>
  );
}

function SceneBurst({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

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
        {label}
      </span>
    </div>
  );
}

function SceneSecure({
  color,
  soft,
  label,
  reduced,
}: {
  color: string;
  soft: string;
  label: string;
  reduced: boolean;
}) {
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
        {label}
      </motion.span>
    </div>
  );
}

function SceneResolve({
  color,
  glow,
  value,
  reduced,
}: {
  color: string;
  glow: string;
  value: string;
  reduced: boolean;
}) {
  if (reduced) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <span className="font-mono text-[10px] font-semibold" style={{ color }}>
          {value}
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
        {value}
      </motion.span>
    </div>
  );
}

function SceneAck({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

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
            {label}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}

function SceneMailSend({ color, reduced }: { color: string; reduced: boolean }) {
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

function SceneMailSync({ color, reduced }: { color: string; reduced: boolean }) {
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

function SceneBidirectional({
  color,
  glow,
  reduced,
}: {
  color: string;
  glow: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>↔ frames</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-[38%] left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.8, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.div
        className="absolute top-[62%] left-0 -translate-y-1/2"
        animate={{ left: ["78%", "8%"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.35,
          times: [0, 0.15, 0.8, 1],
        }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
    </div>
  );
}

function SceneStream({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      {[0, 0.35, 0.7].map((delay) => (
        <motion.div
          key={delay}
          className="absolute top-1/2 left-0 -translate-y-1/2"
          animate={{ left: ["78%", "8%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay,
            repeatDelay: 0.6,
            times: [0, 0.12, 0.85, 1],
          }}
        >
          <Dot color={color} glow={glow} />
        </motion.div>
      ))}
      <span
        className="absolute top-[12%] right-[10%] font-mono text-[9px] font-bold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function ScenePreflight({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%", "78%", "8%"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.22, 0.4, 0.7, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      >
        {label}
      </motion.span>
    </div>
  );
}

function SceneWhoHas({
  color,
  glow,
  query,
  answer,
  reduced,
}: {
  color: string;
  glow: string;
  query: string;
  answer: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{answer}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute top-[10%] left-[10%] text-[8px] font-bold"
        style={{ color }}
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.35, 0.45, 0.9, 1] }}
      >
        {query}
      </motion.span>
      <motion.span
        className="absolute bottom-[8%] right-[8%] font-mono text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.4, 0.5, 0.85, 1] }}
      >
        {answer}
      </motion.span>
    </div>
  );
}

function SceneTranslate({
  color,
  glow,
  from,
  to,
  reduced,
}: {
  color: string;
  glow: string;
  from: string;
  to: string;
  reduced: boolean;
}) {
  if (reduced) {
    return (
      <StaticLabel color={color}>
        {from} → {to}
      </StaticLabel>
    );
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute top-[12%] left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [1, 0, 0, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.4, 0.55, 1] }}
      >
        {from}
      </motion.span>
      <motion.span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.4, 0.5, 0.85, 1] }}
      >
        {to}
      </motion.span>
    </div>
  );
}

function SceneFilter({
  color,
  glow,
  allow,
  deny,
  reduced,
}: {
  color: string;
  glow: string;
  allow: string;
  deny: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{allow}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-[40%] left-0 -translate-y-1/2"
        animate={{ left: ["8%", "82%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.8, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.div
        className="absolute top-[68%] left-0 -translate-y-1/2"
        animate={{ left: ["8%", "45%"], opacity: [0, 1, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
          times: [0, 0.55, 1],
        }}
      >
        <span
          className="block size-2.5 rounded-full"
          style={{ backgroundColor: "#F43F5E", boxShadow: "0 0 10px rgba(244,63,94,0.7)" }}
        />
      </motion.div>
      <span className="absolute top-[8%] right-[8%] text-[8px] font-bold" style={{ color }}>
        {allow}
      </span>
      <span className="absolute bottom-[6%] left-[20%] text-[8px] font-bold text-rose-500">
        {deny}
      </span>
    </div>
  );
}

function SceneHop({
  color,
  glow,
  soft,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  soft: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border"
        style={{ borderColor: `${color}88`, backgroundColor: soft }}
      />
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "46%", "78%", "46%", "8%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[9px] font-bold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function SceneDistribute({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-[36%] left-0 -translate-y-1/2"
        animate={{ left: ["8%", "82%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.8, 1] }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.div
        className="absolute top-[68%] left-0 -translate-y-1/2"
        animate={{ left: ["8%", "82%"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.55,
          times: [0, 0.15, 0.8, 1],
        }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <span
        className="absolute top-[8%] right-[6%] text-[9px] font-bold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function SceneCache({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.35, 0.45, 0.85, 1] }}
      >
        {label}
      </motion.span>
    </div>
  );
}

function SceneRoute({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      {[18, 46, 74].map((left) => (
        <span
          key={left}
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full"
          style={{ left: `${left}%`, backgroundColor: `${color}66` }}
        />
      ))}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "82%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <span
        className="absolute bottom-[8%] right-[8%] font-mono text-[9px] font-bold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function SceneQuery({
  color,
  glow,
  label,
  reduced,
}: {
  color: string;
  glow: string;
  label: string;
  reduced: boolean;
}) {
  if (reduced) return <StaticLabel color={color}>{label}</StaticLabel>;

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2"
        animate={{ left: ["8%", "78%", "8%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Dot color={color} glow={glow} />
      </motion.div>
      <motion.span
        className="absolute top-[12%] left-1/2 max-w-[90%] -translate-x-1/2 truncate font-mono text-[8px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 1, 1, 0, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.15, 0.4, 0.5, 1] }}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[9px] font-bold"
        style={{ color }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.45, 0.55, 0.85, 1] }}
      >
        data
      </motion.span>
    </div>
  );
}

function PulseScene({
  scene,
  color,
  soft,
  glow,
  reduced,
}: {
  scene: ProtocolPulseScene;
  color: string;
  soft: string;
  glow: string;
  reduced: boolean;
}) {
  switch (scene.type) {
    case "roundtrip":
      return <SceneRoundtrip color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "handshake":
      return <SceneHandshake color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "burst":
      return <SceneBurst color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "secure":
      return <SceneSecure color={color} soft={soft} label={scene.label} reduced={reduced} />;
    case "resolve":
      return <SceneResolve color={color} glow={glow} value={scene.value} reduced={reduced} />;
    case "ack":
      return <SceneAck color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "mail-send":
      return <SceneMailSend color={color} reduced={reduced} />;
    case "mail-sync":
      return <SceneMailSync color={color} reduced={reduced} />;
    case "bidirectional":
      return <SceneBidirectional color={color} glow={glow} reduced={reduced} />;
    case "stream":
      return <SceneStream color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "preflight":
      return <ScenePreflight color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "who-has":
      return (
        <SceneWhoHas
          color={color}
          glow={glow}
          query={scene.query}
          answer={scene.answer}
          reduced={reduced}
        />
      );
    case "translate":
      return (
        <SceneTranslate
          color={color}
          glow={glow}
          from={scene.from}
          to={scene.to}
          reduced={reduced}
        />
      );
    case "filter":
      return (
        <SceneFilter
          color={color}
          glow={glow}
          allow={scene.allow}
          deny={scene.deny}
          reduced={reduced}
        />
      );
    case "hop":
      return (
        <SceneHop color={color} glow={glow} soft={soft} label={scene.label} reduced={reduced} />
      );
    case "distribute":
      return <SceneDistribute color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "cache":
      return <SceneCache color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "route":
      return <SceneRoute color={color} glow={glow} label={scene.label} reduced={reduced} />;
    case "query":
      return <SceneQuery color={color} glow={glow} label={scene.label} reduced={reduced} />;
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
        <Endpoint label={pulse.leftLabel ?? "Client"} color={accent.solid} />
        <div className="relative mx-1 h-14 min-w-0 flex-1">
          <div
            className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2"
            style={{ backgroundColor: `${accent.solid}33` }}
          />
          <PulseScene
            scene={pulse.scene}
            color={accent.solid}
            soft={accent.soft}
            glow={accent.glow}
            reduced={reduced}
          />
        </div>
        <Endpoint label={pulse.rightLabel ?? "Server"} color={accent.solid} />
      </div>
    </Link>
  );
}
