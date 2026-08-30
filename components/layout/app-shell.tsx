import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { SkipLink } from "./skip-link";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar className="sticky top-14 hidden h-[calc(100vh-3.5rem)] lg:flex" />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
