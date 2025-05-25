import { Decision, DecisionStatus } from '@/api/database/decisions/decision-repository';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRestartDecisionAnalysis } from '@/hooks/use-restart-decision-analysis';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { DecisionDetailDialog } from './decision-detail-dialog';
import { DecisionsTableFilters } from './decisions-table-filters';
import { StatusIndicator } from './status-indicator';

const columns = [
  { key: 'situation', label: 'Situation' },
  { key: 'decision', label: 'Decision' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
];

type SortKey = 'situation' | 'decision' | 'category' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const sortConverters: Record<SortKey, (d: Decision) => string | number> = {
  createdAt: (d) => new Date(d.createdAt).getTime(),
  status: (d) => d.status || '',
  category: (d) => (d.analysisResult?.category || '').toString().toLowerCase(),
  situation: (d) => (d.situation || '').toString().toLowerCase(),
  decision: (d) => (d.decision || '').toString().toLowerCase(),
};

type DecisionsTableProps = { decisions: Decision[] };
const DecisionsTable: FC<DecisionsTableProps> = ({ decisions }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortState, setSortState] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    situation: '',
    category: '',
    status: '',
  });
  const openDecision = decisions.find((d) => d.id === openId) || null;
  const { act: restartDecision } = useRestartDecisionAnalysis();

  const handleView = (id: string) => {
    setOpenId(id);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setOpenId(null);
    }, 200); // match dialog animation duration
  };

  const handleRestart = async (id: string) => {
      await restartDecision({ id });
  };

  const handleSort = (key: SortKey) => {
    setSortState((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const sortedDecisions = useMemo(() => {
    const sorted = [...decisions];
    sorted.sort((a, b) => {
      const aValue = sortConverters[sortState.key](a);
      const bValue = sortConverters[sortState.key](b);
      return aValue < bValue
        ? (sortState.direction === 'asc' ? -1 : 1)
        : aValue > bValue
        ? (sortState.direction === 'asc' ? 1 : -1)
        : 0;
    });
    return sorted;
  }, [decisions, sortState]);

  const filteredDecisions = useMemo(() => {
    return sortedDecisions.filter((d) => {
      const situationMatch = filters.situation.trim() === '' || d.situation.toLowerCase().includes(filters.situation.trim().toLowerCase());
      const categoryMatch = filters.category.trim() === '' || (d.analysisResult?.category || '').toLowerCase().includes(filters.category.trim().toLowerCase());
      const statusMatch = filters.status === '' || d.status === filters.status;
      return situationMatch && categoryMatch && statusMatch;
    });
  }, [sortedDecisions, filters]);

  const handleStatusChange = (status: string) => {
    setFilters(f => ({ ...f, status: status === "all" ? "" : status }));
  };

  return (
    <>
      <DecisionsTableFilters
        situation={filters.situation}
        onSituationChange={v => setFilters(f => ({ ...f, situation: v }))}
        category={filters.category}
        onCategoryChange={v => setFilters(f => ({ ...f, category: v }))}
        status={filters.status}
        onStatusChange={handleStatusChange}
      />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none"
                onClick={() => handleSort(col.key as SortKey)}
              >
                <span className="inline-flex items-center">
                  {col.label}
                  {sortState.key === col.key && (
                    sortState.direction === 'asc' ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )
                  )}
                </span>
              </TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDecisions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                No data found for the current filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredDecisions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-xs truncate" title={item.situation}>{item.situation}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.decision}>{item.decision}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.analysisResult?.category || ''}>{item.analysisResult?.category || ''}</TableCell>
                <TableCell><StatusIndicator status={item.status} /></TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleView(item.id)}>
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestart(item.id)}
                    disabled={item.status === DecisionStatus.PENDING}
                  >
                    Restart
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DecisionDetailDialog
        decision={openDecision}
        open={isDialogOpen && !!openDecision}
        onClose={handleClose}
      />
    </>
  );
};

export { DecisionsTable };
