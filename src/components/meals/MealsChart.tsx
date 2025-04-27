import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string | null;
  consumedAt: string;
}

interface MealsChartProps {
  mealType: string;
  data: Meal[];
  dateRange: { start: Date; end: Date };
}

export default function MealsChart({ mealType, data, dateRange }: MealsChartProps) {
  const { resolvedTheme } = useTheme();

  // Prepare chart data: sort by date, format date for X axis
  const chartData = data
    .filter(m => m.type === mealType)
    .map(m => ({
      ...m,
      date: new Date(m.consumedAt).toLocaleDateString(),
    }))
    .sort((a, b) => new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime());

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{mealType} Trend</h3>
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
          <Line type="monotone" dataKey="calories" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Calories" />
          <Line type="monotone" dataKey="protein" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Protein (g)" />
          <Line type="monotone" dataKey="carbs" stroke="#f59e42" strokeWidth={2} dot={{ r: 3 }} name="Carbs (g)" />
          <Line type="monotone" dataKey="fat" stroke="#a21caf" strokeWidth={2} dot={{ r: 3 }} name="Fat (g)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 