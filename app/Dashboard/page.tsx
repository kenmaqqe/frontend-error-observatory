"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInboxStore } from "@/lib/store/inboxStore";
import { Activity, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Page() {
  const { events, issues } = useInboxStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalEvents = events.length;
  const uniqueIssues = Object.keys(issues).length;
  const lastEvent = events[0];
  
  const criticalCount = Object.values(issues).filter(i => 
    i.sample.type === "Server" || i.sample.type === "Auth"
  ).length;

  const healthStatus = criticalCount > 5 ? "Critical" : criticalCount > 0 ? "Warning" : "Healthy";

  return (
    <div className="min-h-screen bg-background/50">
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            System Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into your application&apos;s stability and error patterns.
          </p>
        </div>

        <Separator className="my-8 opacity-50" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-rose-500/10 bg-rose-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Activity className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Captured exceptions
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-blue-500/10 bg-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Unique Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uniqueIssues}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Distinct error types
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-amber-500/10 bg-amber-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Last Event</CardTitle>
              <History className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold truncate">
                {lastEvent ? lastEvent.message : "No events"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lastEvent ? new Date(lastEvent.timestamp).toLocaleTimeString() : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className={cn(
            "relative overflow-hidden border-green-500/10 bg-green-500/5",
            healthStatus === "Warning" && "border-amber-500/10 bg-amber-500/5",
            healthStatus === "Critical" && "border-rose-500/10 bg-rose-500/5"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Health</CardTitle>
              <CheckCircle2 className={cn(
                "h-4 w-4 text-green-500",
                healthStatus === "Warning" && "text-amber-500",
                healthStatus === "Critical" && "text-rose-500"
              )} />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                healthStatus === "Healthy" && "text-green-500",
                healthStatus === "Warning" && "text-amber-500",
                healthStatus === "Critical" && "text-rose-500"
              )}>
                {healthStatus}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current platform state
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Issues</CardTitle>
              <CardDescription>The most frequent errors occurring in your system.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.values(issues).length > 0 ? (
                <div className="space-y-4">
                  {Object.values(issues)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map((issue) => (
                      <div key={issue.fingerprint} className="flex items-center justify-between gap-4 rounded-lg border p-3 bg-muted/20">
                        <div className="space-y-1 min-w-0">
                          <div className="text-sm font-medium truncate">{issue.sample.message}</div>
                          <div className="text-xs text-muted-foreground truncate">{issue.sample.url}</div>
                        </div>
                        <Badge variant="outline" className="shrink-0">{issue.count} occurrences</Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground border-dashed border-2 rounded-lg">
                  No issues tracked yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Platform Info</CardTitle>
              <CardDescription>Environment and connectivity status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Environment</div>
                  <div className="font-medium">Local (Development)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Client Info</div>
                  <div className="font-medium">Chrome / Next.js</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Store Strategy</div>
                  <div className="font-medium">LocalStorage (Persisted)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Real-time</div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Connected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

