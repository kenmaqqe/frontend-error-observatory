const httpClient = async (url: string, timeoutMs: number, scenario: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    return res;
  } catch (err) {
    makeAppError({
      type: "Network",
      message: err.message,
      url,
      method: "GET",
      status: err.status,
      scenario,
      durationMs: 0,
      retryAfterSec: 0,
    });
  }
};

export default httpClient;
