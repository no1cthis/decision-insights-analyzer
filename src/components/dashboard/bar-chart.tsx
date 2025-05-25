import { ChartContainer } from '@/components/ui/chart';
import { FC } from 'react';
import { Bar, Cell, Legend, BarChart as ReBarChart, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb', '#b0e0e6', '#ffbb28',
];

type BarChartProps = { data: Record<string, number> };
const BarChart: FC<BarChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([category, value]) => ({
    name: category,
    value,
  }));

  const config = chartData.reduce((acc, item, idx) => {
    acc[item.name] = { label: item.name, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">Decisions by Category (Bar)</h3>
      <ChartContainer config={config} className="h-72">
        <ReBarChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count">
            {chartData.map((entry, idx) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </ReBarChart>
      </ChartContainer>
    </div>
  );
};

export { BarChart };
