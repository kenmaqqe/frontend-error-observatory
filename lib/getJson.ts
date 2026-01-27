const httpClient = async (url: string, method: MethodType) => {
  try {
    const response = await fetch(url, { method: method });
    if (!response.ok) {
      const errorType = mapStatusToErrorType(response.status);
      const errorMessage = await response.json();
      throw makeAppError({
        type: errorType,
        method: method,
        message: errorMessage.error?.message ?? `HTTP ${response.status}`,
        status: response.status,
        url: url,
      });
    }
    return response.json();
  } catch (error) {
    if (isAppError(error)) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw makeAppError({
        type: "Parse",
        message: error.message,
        url: url,
        method: method,
      });
    }
    if (error instanceof TypeError) {
      throw makeAppError({
        type: "Network",
        message: error.message,
        url: url,
        method: method,
      });
    }
    throw makeAppError({
      type: "Unknown",
      message: "Unknown error",
      url: url,
      method: method,
    });
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
