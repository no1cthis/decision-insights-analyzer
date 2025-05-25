"use client";

import { Decision, DecisionStatus } from '@/api/database/decisions/decision-repository';
import { onDecisionAnalysisCompleted } from '@/api/supabase/supabase-browser-client';
import { AnalyzeDecisionButton } from '@/components/buttons/analyze-decision-button';
import { Dashboard } from '@/components/dashboard/dashboard';
import { DecisionsTable } from '@/components/decisions-table/decisions-table';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from '@/components/ui/Loading';
import { useInvalidateQueries } from '@/hooks/use-invalidate-table-and-dashboard';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const { invalidateTable, invalidateDashboard } = useInvalidateQueries();
  const { data, isLoading } = useQuery<{ decisions: Decision[] }>({
    queryKey: ['user-decisions'],
    queryFn: async () => {
      const res = await fetch('/api/user-decisions');
      if (!res.ok) throw new Error('Failed to fetch decisions');
      return res.json();
    },
  });

  // Store unsubscribe functions for each subscription
  const subscriptionsRef = useRef<Record<string, () => void>>({});

  useEffect(() => {
    // Unsubscribe from all previous subscriptions
    Object.values(subscriptionsRef.current).forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') unsubscribe();
    });
    subscriptionsRef.current = {};

    const pendingIds = data?.decisions.filter(d => d.status === DecisionStatus.PENDING).map(d => d.id) || [];

    // Subscribe to all pending decisions
    pendingIds.forEach((id) => {
      const unsubscribe = onDecisionAnalysisCompleted(id, {
        showToast: false,
        onComplete: (decision) => {
          if (decision.status !== DecisionStatus.PENDING) {
            invalidateTable();
            invalidateDashboard();
            if (subscriptionsRef.current[id]) {
              subscriptionsRef.current[id]!();
              delete subscriptionsRef.current[id];
            }
          }
        },
      });
      subscriptionsRef.current[id] = unsubscribe;
    });

    // Cleanup on unmount
    return () => {
      Object.values(subscriptionsRef.current).forEach((unsubscribe) => {
        if (typeof unsubscribe === 'function') unsubscribe();
      });
      subscriptionsRef.current = {};
    };
  }, [data?.decisions, invalidateTable, invalidateDashboard]);

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 bg-muted/50">
      <Card className="w-full max-w-5xl mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Your Decision Analytics</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">Visualize your decision-making patterns by category. Use these insights to reflect and improve your choices over time.</p>
        </CardHeader>
        <CardContent>
          <Dashboard />
        </CardContent>
      </Card>
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="w-full h-px bg-border mb-8" />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Decision History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading />
            ) : data?.decisions.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 flex flex-col items-center gap-4">
                <div className="mb-2">You have no decisions yet.</div>
                <AnalyzeDecisionButton>Analyze your first decision</AnalyzeDecisionButton>
              </div>
            ) : (
              <DecisionsTable decisions={data?.decisions || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
