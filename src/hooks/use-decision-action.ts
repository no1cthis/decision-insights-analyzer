import { Decision } from '@/api/database/decisions/decision-repository';
import { onDecisionAnalysisCompleted } from '@/api/supabase/supabase-browser-client';
import { useState } from 'react';

// Generic hook for decision actions (create/restart)
export function useDecisionAction<T>(
  apiCall: (form: T) => Promise<{ decision?: Decision; error?: string }>
) {
  const [loading, setLoading] = useState(false);

  const act = async (form: T, opts?: { onComplete?: (decision: Decision) => void }) => {
    setLoading(true);
    try {
      const { decision, error } = await apiCall(form);
      if (decision) {
        // Always show toast, always subscribe for notification and callback
        onDecisionAnalysisCompleted(decision.id, {
          showToast: true,
          onComplete: opts?.onComplete,
        });
        return decision;
      } else {
        // Only show error toast if API call fails
        if (typeof window !== 'undefined') {
          // Avoid SSR issues
          import('sonner').then(({ toast }) => {
            toast.error(error || 'Failed to process decision', { position: 'top-right' });
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { act, loading };
}
