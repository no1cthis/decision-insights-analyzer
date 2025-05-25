import { decisionRepository } from '@/api/database/decisions/decision-repository';
import { createSupabaseServerClient } from '@/api/supabase/supabase-server-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient(req, res);
  const dataSession = await supabase.auth.getUser();
  const user = dataSession.data.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decisions = await decisionRepository.getAllByUser(user.id, supabase);
  const categoryCounts: Record<string, number> = {};
  for (const d of decisions) {
    const cat = d.analysisResult?.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  return NextResponse.json({ categoryCounts });
} 