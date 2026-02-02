"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInboxStore } from "@/lib/store/inboxStore";

export default function Page() {
  const events = useInboxStore((state) => state.events);
  return (
    <div>
      <div className="flex items-center justify-between m-2">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Inbox
        </h1>
        <Button>Clear All</Button>
      </div>
      <Separator />
      {events.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {events.map((event) => (
            <Card key={event.id}>{event.message}</Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="">Inbox is a empty</h1>
        </div>
      )}
    </div>
  );
}
