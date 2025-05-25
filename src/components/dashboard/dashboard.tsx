import { Loading } from '@/components/ui/Loading';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { BarChart } from './bar-chart';
import { PieChart } from './pie-chart';

const Dashboard: FC = () => {
  const { data, isLoading, error } = useQuery<{ categoryCounts: Record<string, number> }>({
    queryKey: ['dashboard-category-counts'],
    queryFn: async () => {
      const res = await fetch('/api/user-decisions/summary');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
  });

  if (isLoading) return <Loading message="Loading dashboard..." className="w-full" />;
  if (error) return <div className="w-full text-center py-8 text-destructive">{(error as Error).message}</div>;
  if (!data || !data.categoryCounts || Object.keys(data.categoryCounts).length === 0) return <div className="w-full text-center py-8 text-muted-foreground">No data for dashboard charts.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <PieChart data={data.categoryCounts} />
      <BarChart data={data.categoryCounts} />
    </div>
  );
};

export { Dashboard };
