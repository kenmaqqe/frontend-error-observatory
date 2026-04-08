"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AppError } from "@/lib/error";
import { Badge } from "@/components/ui/badge";
import { JsonView, darkStyles, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, Globe, Hash, Info, Server } from "lucide-react";

interface EventDetailsProps {
  event: AppError | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetails({ event, open, onOpenChange }: EventDetailsProps) {
  const { theme } = useTheme();
  
  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={event.type === "Server" ? "destructive" : "secondary"}>
              {event.type}
            </Badge>
            {event.status && (
              <Badge variant="outline">HTTP {event.status}</Badge>
            )}
          </div>
          <SheetTitle className="text-xl leading-tight pr-8">
            {event.message}
          </SheetTitle>
          <SheetDescription className="text-xs pt-1">
            ID: {event.id}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" /> Context
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                    <Globe className="h-3 w-3" /> Method
                  </span>
                  <span className="font-mono font-medium">{event.method}</span>
                </div>
                <div className="flex flex-col gap-1 py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                    <Server className="h-3 w-3" /> URL
                  </span>
                  <span className="font-mono text-[11px] break-all bg-muted/50 p-1.5 rounded">
                    {event.url}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar className="h-3 w-3" /> Timestamp
                  </span>
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                    <Hash className="h-3 w-3" /> Fingerprint
                  </span>
                  <span className="font-mono text-xs">{event.fingerprint.substring(0, 12)}...</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Metadata & Diagnostics</h4>
              <div className="rounded-lg border bg-muted/30 p-4">
                <JsonView
                  data={event}
                  shouldExpandNode={() => true}
                  style={theme === "dark" ? darkStyles : defaultStyles}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
