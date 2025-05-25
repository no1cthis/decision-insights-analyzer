import { useDecisionAction } from './use-decision-action';

interface DecisionFormData {
  situation: string;
  decision: string;
  reasoning?: string;
}

export function useStartDecisionAnalysis() {
  return useDecisionAction<DecisionFormData>(
    async (form: DecisionFormData) => {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      return { decision: data.decision, error: data.error };
    }
  );
} 