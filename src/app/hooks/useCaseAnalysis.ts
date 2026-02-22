import { useCallback, useEffect, useRef, useState } from 'react';
import { getCase } from '../services/ai-api';
import type { CaseData } from '../types/ai';

export function useCaseAnalysis(caseId?: string) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  const clearPoll = () => {
    if (pollRef.current) {
      window.clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  };

  const loadCase = useCallback(async () => {
    if (!caseId) return;
    setStatus('loading');
    try {
      const data = await getCase(caseId);
      if (!data) {
        setStatus('processing');
        pollRef.current = window.setTimeout(loadCase, 1500);
        return;
      }
      setCaseData(data);
      setStatus('ready');
      setError(null);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to load case');
    }
  }, [caseId]);

  useEffect(() => {
    clearPoll();
    if (!caseId) {
      setStatus('idle');
      return;
    }
    loadCase();
    return () => clearPoll();
  }, [caseId, loadCase]);

  return {
    caseData,
    status,
    error,
    refresh: loadCase,
  };
}
