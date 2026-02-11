"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/Inbox", label: "Inbox" },
  { href: "/Runner", label: "Runner" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-64 flex-col border-r bg-background">
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold tracking-tight">
              Frontend Error Observatory
            </div>
            <div className="text-xs text-muted-foreground">
              local dev console
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        {nav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "font-semibold",
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          );
        })}
      </nav>

      <Separator />

      <div className="px-4 py-4">
        <div className="text-xs text-muted-foreground">
          Tip: Run scenarios to populate Inbox
        </div>
      </div>
    </aside>
  );
}
