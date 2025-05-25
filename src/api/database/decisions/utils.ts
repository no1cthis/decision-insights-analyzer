import { Decision, DecisionDbRow } from "./decision-repository";

export function mapDbRowToDecision(row: DecisionDbRow): Decision {
    return {
      id: row.id,
      userId: row.user_id,
      situation: row.situation_text,
      decision: row.decision_text,
      reasoning: row.reasoning_text,
      status: row.status,
      createdAt: row.created_at,
      analysisResult: row.analysis_result,
    };
  }
  
  export function adaptDecisionUpdatesToDb(updates: Partial<Omit<Decision, 'id' | 'userId' | 'createdAt'>>): Partial<DecisionDbRow> {
    const dbUpdates: Partial<DecisionDbRow> = {};
    if (updates.situation) dbUpdates.situation_text = updates.situation;
    if (updates.decision) dbUpdates.decision_text = updates.decision;
    if (updates.reasoning) dbUpdates.reasoning_text = updates.reasoning;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.analysisResult) dbUpdates.analysis_result = updates.analysisResult;
    return dbUpdates;
  }