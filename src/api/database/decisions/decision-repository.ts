// Repository for managing decision records

import { AnalyzeDecisionResponse } from '@/api/ai/analysis/analyze-decision-prompt';
import { SupabaseClient } from '@supabase/supabase-js';
import { adaptDecisionUpdatesToDb, mapDbRowToDecision } from './utils';

export enum DecisionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface Decision {
  id: string;
  userId: string;
  situation: string;
  decision: string;
  reasoning?: string;
  status: DecisionStatus;
  createdAt: string;
  analysisResult?: AnalyzeDecisionResponse | null;
}


export type DecisionDbRow = {
  id: string;
  user_id: string;
  situation_text: string;
  decision_text: string;
  reasoning_text?: string;
  status: DecisionStatus;
  created_at: string;
  analysis_result?: AnalyzeDecisionResponse | null;
}


export const decisionRepository = {
  async create({ userId, situation, decision, reasoning }: {
    userId: string;
    situation: string;
    decision: string;
    reasoning?: string;
  }, supabaseClient: SupabaseClient): Promise<Decision> {
    const { data, error } = await supabaseClient
      .from('decision')
      .insert([
        {
          user_id: userId,
          situation_text: situation,
          decision_text: decision,
          reasoning_text: reasoning || '',
          status: 'pending',
          created_at: new Date().toISOString()
        },
      ])
      .select();
    if (error) throw new Error(error.message);
    const row = data?.[0];
    return mapDbRowToDecision(row);
  },

  async getById(id: string, supabaseClient: SupabaseClient): Promise<Decision | null> {
    const { data, error } = await supabaseClient
      .from('decision')
      .select()
      .eq('id', id)
      .single();

    console.log('getById', id, data, error);
    if (error) return null;
    return mapDbRowToDecision(data);
  },

  async update(id: string, updates: Partial<Omit<Decision, 'id' | 'userId' | 'createdAt'>>, supabaseClient: SupabaseClient): Promise<Decision | null> {
    const dbUpdates = adaptDecisionUpdatesToDb(updates);
    const { data, error } = await supabaseClient
      .from('decision')
      .update(dbUpdates)
      .eq('id', id)
      .select();
    if (error) return null;
    const row = data?.[0];
    return mapDbRowToDecision(row);
  },

  async delete(id: string, supabaseClient: SupabaseClient): Promise<boolean> {
    const { error } = await supabaseClient
      .from('decision')
      .delete()
      .eq('id', id);
    return !error;
  },

  async getAllByUser(userId: string, supabaseClient: SupabaseClient): Promise<Decision[]> {
    const { data, error } = await supabaseClient
      .from('decision')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map(mapDbRowToDecision);
  }
}; 