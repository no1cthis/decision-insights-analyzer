import { analyzeDecisionWithLLM } from '@/api/ai/analysis/analyze-decision-prompt';
import { decisionRepository, DecisionStatus } from '@/api/database/decisions/decision-repository';
import { createSupabaseServerClient } from '@/api/supabase/supabase-server-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient(req.cookies, res);
  const dataSession = await supabase.auth.getUser();
  const user = dataSession.data.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing decision id' }, { status: 400 });
  }
  const body = await req.json();
  // Only allow status and analysisResult to be updated for restart
  const { status } = body;
  if (status !== DecisionStatus.PENDING) {
    return NextResponse.json({ error: 'Only status=pending is allowed for restart' }, { status: 400 });
  }
  // Fetch the decision to check ownership
  const decision = await decisionRepository.getById(id, supabase);
  console.log('decision', decision, user.id);
  if (!decision || decision.userId !== user.id) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
  }
  // Clear analysisResult and set status to pending
  const updated = await decisionRepository.update(id, { status: DecisionStatus.PENDING, analysisResult: undefined }, supabase);

  // background job to analyze the decision
  analyzeDecisionWithLLM({
    description: decision.situation,
    decision: decision.decision,
    reasons: decision.reasoning,
  }).then((analysisResult) => {
    decisionRepository.update(id, { analysisResult, status: DecisionStatus.COMPLETED }, supabase);
  }).catch((error) => {
    console.error('error', error);
    decisionRepository.update(id, { status: DecisionStatus.FAILED }, supabase);
  });
  return NextResponse.json({ decision: updated });
}