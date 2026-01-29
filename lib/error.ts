interface AppError {
  id: string;
  type: AppErrorType;
  message: string;
  timestamp: number;
  url: string;
  method: MethodType;
  status?: number;
  scenario?: string;
  durationMs?: number;
  retryAfterSec?: number;
}

type AppErrorType =
  | "Auth"
  | "Forbidden"
  | "Server"
  | "Unknown"
  | "RateLimit"
  | "Parse"
  | "Network"
  | "Timeout";

type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const makeAppError = ({
  type,
  message,
  url,
  method,
  status,
  scenario,
  durationMs,
  retryAfterSec,
}: {
  type: AppErrorType;
  message: string;
  url: string;
  method: MethodType;
  status?: number;
  scenario?: string;
  durationMs?: number;
  retryAfterSec?: number;
}) => {
  return {
    id: Date.now().toString() + Math.random().toString(36),
    type: type,
    message: message,
    timestamp: Date.now(),
    url: url,
    method: method,
    status: status,
    scenario: scenario,
    durationMs: durationMs,
    retryAfterSec: retryAfterSec,
  };
};

export const mapStatusToErrorType = (status?: number) => {
  if (typeof status === "number" && status >= 500 && status < 600) {
    return "Server";
  }
  switch (status) {
    case 401:
      return "Auth";
    case 403:
      return "Forbidden";
    case 429:
      return "RateLimit";
    default:
      return "Unknown";
  }
};
