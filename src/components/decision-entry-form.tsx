"use client";

import { Decision } from "@/api/database/decisions/decision-repository";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loading } from '@/components/ui/Loading';
import { Textarea } from "@/components/ui/textarea";
import { useStartDecisionAnalysis } from "@/hooks/use-start-decision-analysis";
import { FC, useState } from "react";

interface DecisionEntryFormProps {
  onSuccess?: (result: Decision) => void;
  onError?: (error: string) => void;
}

const DecisionEntryForm: FC<DecisionEntryFormProps> = ({ onSuccess, onError }) => {
  const [form, setForm] = useState({
    situation: "",
    decision: "",
    reasoning: ""
  });
  const { act, loading } = useStartDecisionAnalysis();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await act(form);
      if (result) {
        setForm({ situation: "", decision: "", reasoning: "" });
        onSuccess?.(result);
      }
    } catch (err: unknown) {
      const message = typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : String(err);
      onError?.(message || "Failed to submit decision");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="situation">Situation</Label>
        <Textarea
          id="situation"
          value={form.situation}
          onChange={handleChange}
          placeholder="Describe the situation..."
          required
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="decision">Decision</Label>
        <Textarea
          id="decision"
          value={form.decision}
          onChange={handleChange}
          placeholder="What decision did you make?"
          required
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="reasoning">Reasoning (optional)</Label>
        <Textarea
          id="reasoning"
          value={form.reasoning}
          onChange={handleChange}
          placeholder="Why did you make this decision?"
          rows={2}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Loading message="Submitting..." className="py-0" /> : "Submit Decision"}
        </Button>
      </div>
    </form>
  );
};

export { DecisionEntryForm };
