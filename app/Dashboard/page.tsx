import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-1px)] bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="space-y-1">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of recent activity and captured events.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Events</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming soon
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Last run</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming soon
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Health</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming soon
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
