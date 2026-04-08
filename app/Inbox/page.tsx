"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInboxStore } from "@/lib/store/inboxStore";
import { Trash2, ExternalLink, Inbox as InboxIcon } from "lucide-react";
import { EventDetails } from "@/components/EventDetails";
import { AppError } from "@/lib/error";

export default function Page() {
  const { events, clear, removeEvent } = useInboxStore();
  const [selectedEvent, setSelectedEvent] = useState<AppError | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleShowDetails = (event: AppError) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background/50">
      <div className="mx-auto w-full max-w-5xl px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">Inbox</h1>
            <p className="text-muted-foreground">
              Captured client-side errors and network failures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
              disabled={events.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        {events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
              >
                <CardHeader className="pb-3 px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={event.type === "Server" ? "destructive" : "secondary"} className="font-semibold px-2 py-0">
                          {event.type}
                        </Badge>
                        {event.status && (
                          <Badge variant="outline" className="font-mono text-[10px] opacity-70">
                            HTTP {event.status}
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground/60 ml-auto sm:ml-0">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <CardTitle className="text-base font-bold leading-tight line-clamp-2"> 
                        {event.message}
                      </CardTitle>

                      <CardDescription className="text-[11px] font-mono truncate bg-muted/40 p-1.5 rounded border border-border/50">
                        {event.method} {event.url}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleShowDetails(event)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-4 px-6">
                  <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground/80 font-medium tracking-wide items-center">
                    {event.scenario && (
                      <span className="rounded-full bg-primary/5 px-2.5 py-0.5 border border-primary/10 text-primary/80">
                        scenario: {event.scenario}
                      </span>
                    )}

                    {typeof event.durationMs === "number" && (
                      <span className="rounded-full bg-blue-500/5 px-2.5 py-0.5 border border-blue-500/10 text-blue-500/80">
                        {event.durationMs}ms
                      </span>
                    )}

                    {typeof event.retryAfterSec === "number" && (
                      <span className="rounded-full bg-amber-500/5 px-2.5 py-0.5 border border-amber-500/10 text-amber-500/80">
                        retry-after: {event.retryAfterSec}s
                      </span>
                    )}
                    
                    <div className="ml-auto flex items-center gap-1 sm:hidden">
                       <Button size="sm" variant="ghost" onClick={() => handleShowDetails(event)}>Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <InboxIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold">Inbox is empty</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
              Run a scenario in the Runner to generate events and test your observability layer.
            </p>
            <Button asChild variant="secondary" className="mt-6 shadow-xs" size="sm">
               <Link href="/Runner">Go to Runner</Link>
            </Button>
          </div>
        )}
      </div>

      <EventDetails 
        event={selectedEvent} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
    </div>
  );
}

import Link from "next/link";

