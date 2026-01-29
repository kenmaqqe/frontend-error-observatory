const httpClient = async (
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
      method: method,
      signal: controller.signal,
    });
    if (!response.ok) {
      if (response.status === 429) {
        let retryAfterSec: number | undefined;
        const ra = response.headers.get("Retry-After");
        if (ra === null) {
          retryAfterSec = undefined;
        } else {
          const n = Number(ra);
          if (Number.isNaN(n)) {
            retryAfterSec = undefined;
          } else {
            retryAfterSec = n;
          }
        }

        const durationMs = durationMsFunctions(startedAt);
        throw makeAppError({
          type: "RateLimit",
          method: method,
          message: "Rate limit exceeded",
          status: response.status,
          url: url,
          scenario: options?.scenario,
          durationMs: durationMs,
          retryAfterSec: retryAfterSec,
        });
      }
      const errorType = mapStatusToErrorType(response.status);
      const errorMessage = await response.json();
      const durationMs = durationMsFunctions(startedAt);
      throw makeAppError({
        type: errorType,
        method: method,
        message: errorMessage.error?.message ?? `HTTP ${response.status}`,
        status: response.status,
        url: url,
        scenario: options?.scenario,
        durationMs: durationMs,
      });
    }
    return await response.json();
  } catch (error) {
    if (isAppError(error)) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      const durationMs = durationMsFunctions(startedAt);
      throw makeAppError({
        type: "Timeout",
        message: error.message,
        url: url,
        method: method,
        durationMs: durationMs,
      });
    }
    if (error instanceof SyntaxError) {
      const durationMs = durationMsFunctions(startedAt);
      throw makeAppError({
        type: "Parse",
        message: error.message,
        url: url,
        method: method,
        durationMs: durationMs,
      });
    }
    if (error instanceof TypeError) {
      const durationMs = durationMsFunctions(startedAt);
      throw makeAppError({
        type: "Network",
        message: error.message,
        url: url,
        method: method,
        durationMs: durationMs,
      });
    }
    const durationMs = durationMsFunctions(startedAt);
    throw makeAppError({
      type: "Unknown",
      message: "Unknown error",
      url: url,
      method: method,
      durationMs: durationMs,
    });
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
};

const isAppError = (error: unknown): error is AppError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    "timestamp" in error
  );
};

const durationMsFunctions = (startedAt: number) => {
  return Math.round(performance.now() - startedAt);
};
