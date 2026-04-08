"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { httpClient, isAppError } from "@/lib/getJson";
import { useInboxStore } from "@/lib/store/inboxStore";
import { toast } from "sonner";
import { PlayCircle, ShieldAlert, Cpu, Laptop, Terminal } from "lucide-react";

const items = [
  { label: "Success 200 OK", value: "ok", type: "success" },
  { label: "Unauthorized 401", value: "unauthorized_401", type: "auth" },
  { label: "Forbidden 403", value: "forbidden_403", type: "auth" },
  { label: "Internal Server Error 500", value: "server_error_500", type: "error" },
  { label: "Service Unavailable 503", value: "server_error_503", type: "error" },
  { label: "Too Many Requests 429", value: "rate_limit_429", type: "warning" },
  { label: "Invalid JSON Parsing", value: "invalid_json", type: "warning" },
  { label: "Slow Response (3s)", value: "slow_200", type: "info" },
  { label: "Request Timeout", value: "timeout", type: "error" },
];

const Page = () => {
  const [value, setValue] = useState("ok");
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();
  const add = useInboxStore((state) => state.add);

  const runnerFunction = async () => {
    setIsRunning(true);
    try {
      const res = await httpClient(`/api/mock?scenario=${value}`, "GET");
      toast.success("Request successful", {
        description: `Backend returned success for "${activeLabel}"`,
      });
      return res.data;
    } catch (error) {
      if (isAppError(error)) {
        add(error);
        toast.error("Event captured", {
          description: `${error.type}${error.status ? ` • HTTP ${error.status}` : ""} • ${activeLabel}`,
          position: "top-center",
          duration: 4500,
          action: {
            label: "Open Inbox",
            onClick: () => router.push("/Inbox"),
          },
        });
      } else {
        toast.error("Low level error", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const activeLabel = items.find((i) => i.value === value)?.label ?? value;

  return (
    <div className="min-h-screen bg-background/50">
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
             <PlayCircle className="h-10 w-10 text-primary" />
             Runner
          </h1>
          <p className="text-muted-foreground">
            Simulate realistic API scenarios to verify your observability layer.
          </p>
        </div>

        <Separator className="my-8 opacity-50" />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
          <Card className="shadow-lg border-primary/10 overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-primary to-primary/20" />
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl">Simulation Control</CardTitle>
              <CardDescription>
                Configure the request parameters and trigger the simulation.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 space-y-8">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <div className="text-sm font-semibold flex items-center gap-2">
                     <Cpu className="h-4 w-4 text-muted-foreground" />
                     Scenario Type
                  </div>
                  <Select defaultValue={value} onValueChange={(v) => setValue(v)}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Scenarios</SelectLabel>
                        {items.map((item) => (
                          <SelectItem key={item.value} value={item.value} className="py-3">
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold flex items-center gap-2">
                     <Laptop className="h-4 w-4 text-muted-foreground" />
                     Execution
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button 
                      size="lg"
                      className="px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95" 
                      onClick={() => runnerFunction()}
                      disabled={isRunning}
                    >
                      {isRunning ? "Running..." : "Run Scenario"}
                    </Button>
                    <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border">
                       Tip: 400x and 500x errors are automatically sent to Inbox.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-md bg-muted/30 border-dashed">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground/80">
                   <Terminal className="h-4 w-4" /> Request Inspector
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-background">GET</Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                     /api/mock
                  </Badge>
                </div>

                <div className="rounded-xl border bg-black/5 p-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                    Query Params
                  </div>
                  <code className="text-[11px] block font-mono text-foreground/80">
                     ?scenario={value}
                  </code>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground leading-relaxed">
                   <ShieldAlert className="h-3 w-3 shrink-0" />
                   Errors will be parsed and fingerprinted before storage.
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-primary/5">
               <CardContent className="pt-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
                     Real-time logs
                  </div>
                  <div className="h-32 bg-zinc-950 rounded-lg p-3 font-mono text-[10px] text-green-500/80 overflow-auto border border-white/5">
                     <div>[system] ready...</div>
                     {isRunning && (
                       <div className="animate-pulse">[network] sending request to /api/mock...</div>
                     )}
                     {!isRunning && (
                       <div>[status] idle</div>
                     )}
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
