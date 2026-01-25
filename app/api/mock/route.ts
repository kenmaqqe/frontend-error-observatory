import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scenario = searchParams.get("scenario") ?? "ok";

  // OK
  if (scenario === "ok") {
    return NextResponse.json({
      data: { message: "OK", items: [1, 2, 3] },
      meta: { scenario },
    });
  }

  // 401
  if (scenario === "unauthorized_401") {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Token expired" } },
      { status: 401 },
    );
  }

  // 403
  if (scenario === "forbidden_403") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
      { status: 403 },
    );
  }

  // 500
  if (scenario === "server_error_500") {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Unexpected error" } },
      { status: 500 },
    );
  }

  // 429
  if (scenario === "rate_limit_429") {
    return new NextResponse(
      JSON.stringify({
        error: { code: "RATE_LIMIT", message: "Too many requests" },
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "2",
        },
      },
    );
  }

  // Slow response
  if (scenario === "slow_200") {
    await sleep(2500);
    return NextResponse.json({
      data: { message: "SLOW_OK", items: [1, 2, 3] },
      meta: { scenario },
    });
  }

  // Invalid JSON
  if (scenario === "invalid_json") {
    return new NextResponse('{ "data": ', {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Empty
  if (scenario === "empty_200") {
    return NextResponse.json({
      data: { items: [] },
      meta: { scenario },
    });
  }

  return NextResponse.json(
    { error: { code: "UNKNOWN_SCENARIO", message: scenario } },
    { status: 400 },
  );
}
