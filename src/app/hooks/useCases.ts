import { useEffect, useState } from "react";
import { listCases } from "../services/ai-api";
import type { CaseSummary } from "../types/ai";

export function useCases(limit = 20) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listCases(limit)
      .then((data) => {
        if (!active) return;
        setCases(data);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load cases");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return { cases, loading, error };
}
