import { cn } from "@/lib/utils";

export function ResultRow({
  label,
  value,
  mono = true,
  hint,
}: {
  label: string;
  value: string;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/40 py-2 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs font-medium text-muted-foreground sm:w-36">{label}</dt>
      <dd className="min-w-0 flex-1">
        <span className={cn("break-all text-sm", mono && "font-mono")}>{value}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
