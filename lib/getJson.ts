import { makeAppError, mapStatusToErrorType } from "./error";

type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const httpClient = async (
  url: string,
  method: MethodType,
  options?: { timeoutMs?: number; scenario?: string },
) => {
  const startedAt = performance.now();
  const controller = new AbortController();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (options?.timeoutMs !== undefined) {
    timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);
  }

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        const ra = response.headers.get("Retry-After");
        const retryAfterSec =
          ra !== null && !Number.isNaN(Number(ra)) ? Number(ra) : undefined;

        throw makeAppError({
          type: "RateLimit",
          method,
          message: "Rate limit exceeded",
          status: response.status,
          url,
          scenario: options?.scenario,
          durationMs: durationMs(startedAt),
          retryAfterSec,
        });
      }

      let body: any = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      throw makeAppError({
        type: mapStatusToErrorType(response.status),
        method,
        message: body?.error?.message ?? `HTTP ${response.status}`,
        status: response.status,
        url,
        scenario: options?.scenario,
        durationMs: durationMs(startedAt),
      });
    }

    return await response.json();
  } catch (error: unknown) {
    if (isAppError(error)) {
      throw error;
    }

    const isAbortError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as any).name === "AbortError";

    if (isAbortError) {
      throw makeAppError({
        type: "Timeout",
        message: "Request aborted (timeout)",
        url,
        method,
        durationMs: durationMs(startedAt),
      });
    }

    const isSyntaxError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as any).name === "SyntaxError";

    if (isSyntaxError) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as any).message)
          : "Failed to parse JSON";

      throw makeAppError({
        type: "Parse",
        message,
        url,
        method,
        durationMs: durationMs(startedAt),
      });
    }

    const isTypeError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as any).name === "TypeError";

    if (isTypeError) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as any).message)
          : "Network error";

      throw makeAppError({
        type: "Network",
        message,
        url,
        method,
        durationMs: durationMs(startedAt),
      });
    }

    throw makeAppError({
      type: "Unknown",
      message: "Unknown error",
      url,
      method,
      durationMs: durationMs(startedAt),
    });
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
};

export const isAppError = (error: unknown): error is AppError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    "timestamp" in error
  );
};

const durationMs = (startedAt: number) =>
  Math.round(performance.now() - startedAt);
