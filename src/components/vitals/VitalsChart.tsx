import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface Vital {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}

interface VitalsChartProps {
  vitalType: string;
  data: Vital[];
  dateRange: { start: Date; end: Date };
}

export default function VitalsChart({ vitalType, data, dateRange }: VitalsChartProps) {
  const { resolvedTheme } = useTheme ? useTheme() : { resolvedTheme: 'light' };

  // Prepare chart data: sort by date, format date for X axis
  const chartData = data
    .filter(v => v.type === vitalType)
    .map(v => ({
      ...v,
      date: new Date(v.recordedAt).toLocaleDateString(),
    }))
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{vitalType} Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#444' : '#ccc'} />
          <XAxis
            dataKey="date"
            stroke={resolvedTheme === 'dark' ? '#fff' : '#333'}
            tick={{ fill: resolvedTheme === 'dark' ? '#fff' : '#333', fontSize: 12, style: { color: resolvedTheme === 'dark' ? '#fff' : '#333' } }}
            label={{
              value: 'Date',
              position: 'insideBottom',
              offset: -5,
              fill: resolvedTheme === 'dark' ? '#fff' : '#333',
              fontSize: 14,
              style: { color: resolvedTheme === 'dark' ? '#fff' : '#333' }
            }}
          />
          <YAxis
            stroke={resolvedTheme === 'dark' ? '#fff' : '#333'}
            tick={{ fill: resolvedTheme === 'dark' ? '#fff' : '#333', fontSize: 12, style: { color: resolvedTheme === 'dark' ? '#fff' : '#333' } }}
            label={{
              value: 'Value',
              angle: -90,
              position: 'insideLeft',
              fill: resolvedTheme === 'dark' ? '#fff' : '#333',
              fontSize: 14,
              dx: -10,
              style: { color: resolvedTheme === 'dark' ? '#fff' : '#333' }
            }}
          />
          <Tooltip contentStyle={{ background: resolvedTheme === 'dark' ? '#222' : '#fff', color: resolvedTheme === 'dark' ? '#fff' : '#333' }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Value" />
          {chartData.some(d => d.value2 !== undefined) && (
            <Line type="monotone" dataKey="value2" stroke="#a21caf" strokeWidth={2} dot={{ r: 3 }} name="Value 2" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 