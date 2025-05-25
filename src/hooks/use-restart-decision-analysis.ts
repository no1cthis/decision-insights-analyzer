import { Decision, DecisionStatus } from '@/api/database/decisions/decision-repository';
import { onDecisionAnalysisCompleted } from '@/api/supabase/supabase-browser-client';
import { useInvalidateQueries } from '@/hooks/use-invalidate-table-and-dashboard';
import { useState } from 'react';

export function useRestartDecisionAnalysis() {
  const { invalidateTable, invalidateDashboard } = useInvalidateQueries();
  const [loading, setLoading] = useState(false);

  const act = async (form: { id: string }) => {
    setLoading(true);
    try {
      const { id } = form;
      const res = await fetch(`/api/decisions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: DecisionStatus.PENDING }),
      });
      invalidateTable();
      invalidateDashboard();
      const data = await res.json();
      const decision: Decision | undefined = data.decision;
      if (decision) {
        onDecisionAnalysisCompleted(decision.id, {
          showToast: true,
          onComplete: () => {
            invalidateTable();
            invalidateDashboard();
          },
        });
        return decision;
      } else {
        if (typeof window !== 'undefined') {
          import('sonner').then(({ toast }) => {
            console.log('error', data.error);
            toast.error(data.error || 'Failed to process decision', { position: 'top-right' });
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { act, loading };
} 