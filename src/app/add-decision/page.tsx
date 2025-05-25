"use client";

import { DecisionEntryForm } from '@/components/decision-entry-form';
import { useRouter } from 'next/navigation';

export default function DecisionAnalyzePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Submit a Decision for Analysis</h1>
      <div className="w-full max-w-md">
        <DecisionEntryForm
          onSuccess={() => {
            router.push('/');
          }}
        />
      </div>
    </div>
  );
} 