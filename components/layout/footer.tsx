import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="container flex flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          {SITE_NAME} © {new Date().getFullYear()}
        </p>
        <p>Built for developers, by developers</p>
      </div>
    </footer>
  );
}
