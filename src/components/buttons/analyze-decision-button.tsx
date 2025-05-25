import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type AnalyzeDecisionButtonProps = { className?: string; children?: ReactNode };
const AnalyzeDecisionButton: FC<AnalyzeDecisionButtonProps> = ({ className = '', children }) => {
  return (
    <Link href="/add-decision" className={className}>
      <Button size="lg" className="gap-2 w-full md:w-auto">
        <PlusCircle className="w-5 h-5" />
        {children || 'Analyze Decision'}
      </Button>
    </Link>
  );
};

export { AnalyzeDecisionButton };
