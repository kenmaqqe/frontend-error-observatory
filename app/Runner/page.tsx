"use client";

import { useState } from "react";
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
import { httpClient, isAppError } from "@/lib/getJson";
import { useInboxStore } from "@/lib/store/inboxStore";

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
  const add = useInboxStore((state) => state.add);

  const runnerFunction = async () => {
    try {
      const res = await httpClient(`/api/mock?scenario=${value}`, "GET");
      return res.data;
    } catch (error) {
      if (isAppError(error)) add(error);
    }
  };
  return (
    <div>
      <h1>Runner</h1>
      <p>Chose scenario:</p>
      <Select defaultValue={value} onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue />
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
      <Button onClick={() => runnerFunction()}>Run</Button>
    </div>
  );
};

export default Page;
