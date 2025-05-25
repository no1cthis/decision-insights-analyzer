import { analyzeDecisionWithLLM } from '@/api/ai/analysis/analyze-decision-prompt';
import { decisionRepository, DecisionStatus } from '@/api/database/decisions/decision-repository';
import { createSupabaseServerClient } from '@/api/supabase/supabase-server-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Create a new decision
 * @param req - The request object
 * @returns The created decision
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient(req, res);
  const dataSession = await supabase.auth.getUser();
  const user = dataSession.data.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { situation, decision, reasoning } = body;
  if (!situation || !decision) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const created = await decisionRepository.create({
      userId: user.id,
      situation,
      decision,
      reasoning,
    }, supabase);

    // background job to analyze the decision
    analyzeDecisionWithLLM({
      description: situation,
      decision,
      reasons: reasoning,
    }).then((analysisResult) => {
      decisionRepository.update(created.id, { analysisResult, status: DecisionStatus.COMPLETED }, supabase);
    }).catch((error) => {
      console.error('error', error);
      decisionRepository.update(created.id, { status: DecisionStatus.FAILED }, supabase);
    });

    // we return the decision immediately, but the analysis will be done in the background, 
    // so user can use website while the analysis is running and get notification when it's done
    return NextResponse.json({ decision: created });
  } catch (error: unknown) {
    const message = typeof error === 'object' && error && 'message' in error ? (error as { message?: string }).message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 