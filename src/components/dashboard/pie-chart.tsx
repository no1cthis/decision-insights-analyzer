import { ChartContainer } from '@/components/ui/chart';
import { FC } from 'react';
import { Cell, Legend, Pie, PieChart as RePieChart } from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb', '#b0e0e6', '#ffbb28',
];

type PieChartProps = { data: Record<string, number> };
const PieChart: FC<PieChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([category, value]) => ({
    name: category,
    value,
  }));

  const config = chartData.reduce((acc, item, idx) => {
    acc[item.name] = { label: item.name, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Decisions by Category (Pie)</h3>
      <ChartContainer config={config} className="h-72">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {chartData.map((entry, idx) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </RePieChart>
      </ChartContainer>
    </div>
  );
};

export { PieChart };
