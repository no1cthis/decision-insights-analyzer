// This file sets up the Supabase client for use in Next.js.
// NEXT_PUBLIC_* env variables are available at build/runtime in Next.js.
// If you see linter errors about 'process', ensure @types/node is installed.

import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { Decision, DecisionDbRow, DecisionStatus } from '../database/decisions/decision-repository';
import { mapDbRowToDecision } from '../database/decisions/utils';

const client = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Multi-subscriber support for analysis complete ---
const analysisSubscribers: Record<string, Set<(decision: Decision) => void>> = {};
const analysisChannels: Record<string, ReturnType<typeof client.channel>> = {};

export const supabaseBrowserClient = { ...client,
subscribeToJobStatus(jobId: string, onStatusChange: (status: string) => void) {
  if (!jobId) return;
  const channel = client
    .channel('job-status-' + jobId)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'job_queue',
        filter: `id=eq.${jobId}`
      },
      (payload) => {
        const newStatus = payload.new.status;
        onStatusChange(newStatus);
        client.removeChannel(channel); // Unsubscribe after first notification
      }
    )
    .subscribe();
},

subscribeToAnalysisComplete(decisionId: string, onAnalysisComplete: (decision: Decision) => void) {
  if (!decisionId) return () => {};
  // Register the callback
  if (!analysisSubscribers[decisionId]) {
    analysisSubscribers[decisionId] = new Set();
  }
  analysisSubscribers[decisionId].add(onAnalysisComplete);

  // Create the channel if it doesn't exist
  if (!analysisChannels[decisionId]) {
    const channel = client
      .channel('decision-status-' + decisionId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'decision',
          filter: `id=eq.${decisionId}`
        },
        (payload) => {
          const decision = mapDbRowToDecision(payload.new as DecisionDbRow);
          // Call all registered callbacks
          analysisSubscribers[decisionId]?.forEach(cb => cb(decision));
        }
      )
      .subscribe();
    analysisChannels[decisionId] = channel;
  }

  // Return unsubscribe function
  return () => {
    analysisSubscribers[decisionId]?.delete(onAnalysisComplete);
    if (analysisSubscribers[decisionId]?.size === 0) {
      // No more subscribers, remove channel
      if (analysisChannels[decisionId]) {
        client.removeChannel(analysisChannels[decisionId]);
        delete analysisChannels[decisionId];
      }
      delete analysisSubscribers[decisionId];
    }
  };
}
}

/**
 * Subscribe to analysis completion for a decision, with optional toast and callback.
 * Returns an unsubscribe function.
 */
export function onDecisionAnalysisCompleted(
  decisionId: string,
  opts?: {
    showToast?: boolean;
    onComplete?: (decision: Decision) => void;
  }
) {
  if (!decisionId) return () => {};
  // Keep track of the unsubscribe function
  const unsubscribe = supabaseBrowserClient.subscribeToAnalysisComplete(decisionId, (decision) => {
    if (opts?.showToast) {
      const situationLength = 20;
      const shortSituation = decision.situation.length > situationLength ? decision.situation.substring(0, situationLength) + '...' : decision.situation;
      if (decision.status === DecisionStatus.COMPLETED) {
        toast.success(`Analysis for "${shortSituation}" situation is complete!`, { position: 'top-right' });
      } else if (decision.status === DecisionStatus.FAILED) {
        toast.error(`Analysis for "${shortSituation}" situation failed!`, { position: 'top-right' });
      }
    }
    if (opts?.onComplete) {
      opts.onComplete(decision);
    }
    // Unsubscribe after analysis is complete or failed
    if (decision.status === DecisionStatus.COMPLETED || decision.status === DecisionStatus.FAILED) {
      unsubscribe();
    }
  });
  return unsubscribe;
}