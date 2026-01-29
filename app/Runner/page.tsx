"use client";

import { useEffect } from "react";
import { httpClient, isAppError } from "../../lib/getJson";

const scenarios = [
  "ok",
  "unauthorized_401",
  "forbidden_403",
  "server_error_500",
  "rate_limit_429",
  "invalid_json",
  "slow_200",
];

export default function RunnerPage() {
  useEffect(() => {
    const runScenario = async (scenario: string) => {
      try {
        const data = await httpClient(`/api/mock?scenario=${scenario}`, "GET", {
          timeoutMs: 1000,
          scenario,
        });
        console.log(`✅ [${scenario}] OK`, data);
      } catch (e) {
        if (isAppError(e)) {
          console.log(`❌ [${scenario}] AppError`, e);
        } else {
          console.error(`💥 [${scenario}] NOT AppError`, e);
        }
      }
    };

    // запускаємо по черзі з невеликою паузою
    const runAll = async () => {
      for (const scenario of scenarios) {
        await runScenario(scenario);
        await new Promise((r) => setTimeout(r, 500));
      }
    };

    runAll();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Runner</h1>
      <p>Open console to see results</p>
    </div>
  );
}
