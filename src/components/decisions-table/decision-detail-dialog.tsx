import { Decision } from '@/api/database/decisions/decision-repository';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FC } from 'react';
import { StatusIndicator } from './status-indicator';

interface DecisionDetailDialogProps {
  decision: Decision | null;
  open: boolean;
  onClose: () => void;
}

const DecisionDetailDialog: FC<DecisionDetailDialogProps> = ({ decision, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Decision Details</DialogTitle>
          <DialogDescription>ID: {decision?.id}</DialogDescription>
        </DialogHeader>
        {decision && (
          <div className="space-y-2">
            <div><strong>Situation:</strong> {decision.situation}</div>
            <div><strong>Decision:</strong> {decision.decision}</div>
            {decision.reasoning && <div><strong>Reasoning:</strong> {decision.reasoning}</div>}
            <div><strong>Status:</strong> <StatusIndicator status={decision.status} /></div>
            <div><strong>Date:</strong> {new Date(decision.createdAt).toLocaleString()}</div>
            {decision.analysisResult && (
              <div className="mt-4 space-y-2">
                <div className="font-semibold">AI Analysis</div>
                {decision.analysisResult.category && (
                  <div><strong>Category:</strong> {decision.analysisResult.category}</div>
                )}
                {decision.analysisResult.explanation && (
                  <div><strong>Explanation:</strong> {decision.analysisResult.explanation}</div>
                )}
                {decision.analysisResult.cognitiveDistortions?.length > 0 && (
                  <div>
                    <strong>Cognitive Distortions:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {decision.analysisResult.cognitiveDistortions.map((cd, i) => (
                        <li key={i}>{cd}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {decision.analysisResult.missedAlternatives?.length > 0 && (
                  <div>
                    <strong>Missed Alternatives:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {decision.analysisResult.missedAlternatives.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="secondary">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DecisionDetailDialog };
