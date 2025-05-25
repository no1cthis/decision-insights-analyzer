"use client";

import { supabaseBrowserClient } from '@/api/supabase/supabase-browser-client';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/Loading';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

const SubmitJobButton: FC = () => {
  const [loading, setLoading] = useState(false);

  const onStatusChange = useCallback((status: string) => {
    if (status === 'completed') {
      toast('Job completed!', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, []);

  const handleClick = async () => {
    setLoading(true);
    // Example payload
    const payload = { message: 'Process this job!' };
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload })
    });
    const data = await res.json();
    if (data.job && data.job.id) {
      supabaseBrowserClient.subscribeToJobStatus(data.job.id, onStatusChange);
    } else {
      toast.error('Failed to submit job');
    }
    setLoading(false);
  };

  return (
    <Button type="button" onClick={handleClick} disabled={loading}>
      {loading ? <Loading message="Submitting..." className="py-0" /> : 'Submit Job'}
    </Button>
  );
};

export { SubmitJobButton };
