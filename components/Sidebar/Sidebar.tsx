"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Inbox, PlayCircle, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";


const nav = [
  { href: "/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/Inbox", label: "Inbox", icon: Inbox },
  { href: "/Runner", label: "Runner", icon: PlayCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-64 flex-col border-r bg-card/50 backdrop-blur-md">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="font-bold tracking-tight text-lg">
            Observatory
          </div>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 px-0.5">
          Client Error Monitoring
        </div>
      </div>

      <div className="px-3 mb-4">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>


      <nav className="flex flex-1 flex-col gap-1.5 px-3">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 transition-all duration-200",
                isActive 
                  ? "bg-secondary/80 font-semibold shadow-sm" 
                  : "text-muted-foreground hover:translate-x-1"
              )}
            >
              <Link href={item.href}>
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground/70")} />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-6 flex items-center justify-between gap-2">
        <div className="flex-1 rounded-xl bg-muted/40 p-4 border border-border/50">
          <div className="text-[11px] font-semibold text-muted-foreground/70 uppercase mb-2">
            Status
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-xs font-medium">Monitoring Active</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

    </aside>
  );
}

