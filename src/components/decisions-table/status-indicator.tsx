import { DecisionStatus } from '@/api/database/decisions/decision-repository';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { FC } from 'react';

type StatusIndicatorProps = { status: DecisionStatus };
const StatusIndicator: FC<StatusIndicatorProps> = ({ status }) => {
  switch (status) {
    case DecisionStatus.PENDING:
      return (
        <span className="inline-flex items-center" title="Pending">
          <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
        </span>
      );
    case DecisionStatus.COMPLETED:
      return (
        <span className="inline-flex items-center" title="Completed">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </span>
      );
    case DecisionStatus.FAILED:
      return (
        <span className="inline-flex items-center" title="Failed">
          <XCircle className="w-4 h-4 text-red-500" />
        </span>
      );
    default:
      return null;
  }
};

export { StatusIndicator };
