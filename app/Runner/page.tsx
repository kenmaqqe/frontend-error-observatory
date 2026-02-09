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
import {toast} from 'sonner'

const items = [
  { label: "OK", value: "ok" },
  { label: "Unauthorized 401", value: "unauthorized_401" },
  { label: "Forbidden 403", value: "forbidden_403" },
  { label: "Server Error 500", value: "server_error_500" },
  { label: "Rate Limit 429", value: "rate_limit_429" },
  { label: "Invalid JSON", value: "invalid_json" },
  { label: "Slow 200", value: "slow_200" },
];

const Page = () => {
  const [value, setValue] = useState("ok");
  const router = useRouter();
  const add = useInboxStore((state) => state.add);

  const runnerFunction = async () => {
    try {
      const res = await httpClient(`/api/mock?scenario=${value}`, "GET");
      return res.data;
    } catch (error) {
      if (isAppError(error)) {
        add(error) 
        toast.error("Error was handled", {position: "top-center", action: {
          label: "See in inbox",
          onClick: ()=> router.push('/Inbox')
        }})
      };

    }
  };

  const activeLabel = items.find((i) => i.value === value)?.label ?? value;

  return (
    <div className="min-h-[calc(100vh-1px)] bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="space-y-1">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
            Runner
          </h1>
          <p className="text-sm text-muted-foreground">
            Simulate API scenarios and send generated events to Inbox.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Scenario control</CardTitle>
              <CardDescription>
                Choose a scenario and press Run to trigger the request.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Scenario</div>
                <Select defaultValue={value} onValueChange={(v) => setValue(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Scenarios</SelectLabel>
                      {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button className="sm:w-auto" onClick={() => runnerFunction()}>
                  Run
                </Button>
                <p className="text-xs text-muted-foreground">
                  Output is sent to Inbox on error.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Selected</CardTitle>
              <CardDescription>Current target for simulation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{activeLabel}</Badge>
                <Badge variant="outline">GET</Badge>
              </div>

              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                /api/mock?scenario={value}
              </div>

              <p className="text-xs text-muted-foreground">
                Tip: after running a failing scenario, open Inbox to inspect the
                captured event.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
