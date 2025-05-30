import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from "@/components/ThemeProvider";
import { formatLocalDate } from '@/utils/dateUtils';

interface Workout {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  notes?: string | null;
  completedAt: string;
}

interface WorkoutsChartProps {
  workoutType: string;
  data: Workout[];
  dateRange: { start: Date; end: Date };
}

export default function WorkoutsChart({ workoutType, data, dateRange }: WorkoutsChartProps) {
  const { theme, systemTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  // Prepare chart data: sort by date, format date for X axis
  const chartData = data
    .filter(w => w.type === workoutType)
    .map(w => ({
      ...w,
      date: formatLocalDate(w.completedAt),
    }))
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{workoutType} Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
          <XAxis
            dataKey="date"
            stroke={isDark ? '#fff' : '#333'}
            tick={{ fill: isDark ? '#fff' : '#333', fontSize: 12, style: { color: isDark ? '#fff' : '#333' } }}
            label={{
              value: 'Date',
              position: 'insideBottom',
              offset: -5,
              fill: isDark ? '#fff' : '#333',
              fontSize: 14,
              style: { color: isDark ? '#fff' : '#333' }
            }}
          />
          <YAxis
            stroke={isDark ? '#fff' : '#333'}
            tick={{ fill: isDark ? '#fff' : '#333', fontSize: 12, style: { color: isDark ? '#fff' : '#333' } }}
            label={{
              value: 'Value',
              angle: -90,
              position: 'insideLeft',
              fill: isDark ? '#fff' : '#333',
              fontSize: 14,
              dx: -10,
              style: { color: isDark ? '#fff' : '#333' }
            }}
          />
          <Tooltip contentStyle={{ background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#333' }} />
          <Legend />
          <Line type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Duration (min)" />
          <Line type="monotone" dataKey="caloriesBurned" stroke="#a21caf" strokeWidth={2} dot={{ r: 3 }} name="Calories Burned" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 