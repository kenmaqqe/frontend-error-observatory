"use client";

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

export default function Page() {
  const events = useInboxStore((state) => state.events);
  const clearAll = useInboxStore((state) => state.clear)

  return (
    <div className="min-h-[calc(100vh-1px)] bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
              Inbox
            </h1>
            <p className="text-sm text-muted-foreground">
              Incoming client-side error events captured by your observability
              layer.
            </p>
          </div>

          <Button variant="outline" onClick={clearAll}>Clear all</Button>
        </div>

        <Separator className="my-6" />

        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{event.type}</Badge>
                        {event.status ? (
                          <Badge variant="outline">HTTP {event.status}</Badge>
                        ) : null}
                      </div>

                      <CardTitle className="text-base leading-tight">
                        {event.message}
                      </CardTitle>

                      <CardDescription className="text-xs">
                        {event.method} • {event.url}
                      </CardDescription>
                    </div>

                    <Button variant="ghost" size="sm" className="shrink-0">
                      Details
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {event.scenario ? (
                      <span className="rounded-md bg-muted px-2 py-1">
                        scenario: {event.scenario}
                      </span>
                    ) : null}

                    {typeof event.durationMs === "number" ? (
                      <span className="rounded-md bg-muted px-2 py-1">
                        {event.durationMs}ms
                      </span>
                    ) : null}

                    {typeof event.retryAfterSec === "number" ? (
                      <span className="rounded-md bg-muted px-2 py-1">
                        retry-after: {event.retryAfterSec}s
                      </span>
                    ) : null}

                    <span className="rounded-md bg-muted px-2 py-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Inbox is empty</CardTitle>
              <CardDescription>
                Run a scenario in Runner to generate events.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
