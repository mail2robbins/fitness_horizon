"use client";

import { useState } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

interface WorkoutFiltersProps {
  workoutTypes: string[];
  onFilterChange: (filters: WorkoutFilters) => void;
}

export interface WorkoutFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  types: string[];
  period: 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
}

export default function WorkoutFilters({ workoutTypes, onFilterChange }: WorkoutFiltersProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [period, setPeriod] = useState<WorkoutFilters['period']>('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const handlePeriodChange = (newPeriod: WorkoutFilters['period']) => {
    setPeriod(newPeriod);
    let start: Date;
    let end: Date;

    switch (newPeriod) {
      case 'daily':
        start = startOfDay(new Date());
        end = endOfDay(new Date());
        break;
      case 'weekly':
        start = startOfWeek(new Date());
        end = endOfWeek(new Date());
        break;
      case 'monthly':
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
        break;
      case 'yearly':
        start = startOfYear(new Date());
        end = endOfYear(new Date());
        break;
      case 'custom':
        start = new Date(customDateRange.start);
        end = new Date(customDateRange.end);
        break;
      default:
        start = new Date(0);
        end = new Date();
        break;
    }

    onFilterChange({
      dateRange: { start, end },
      types: selectedTypes,
      period: newPeriod,
    });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    onFilterChange({
      dateRange: getDateRangeForPeriod(period),
      types: newTypes,
      period,
    });
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value,
    }));

    if (period === 'custom') {
      onFilterChange({
        dateRange: {
          start: new Date(field === 'start' ? value : customDateRange.start),
          end: new Date(field === 'end' ? value : customDateRange.end),
        },
        types: selectedTypes,
        period: 'custom',
      });
    }
  };

  const getDateRangeForPeriod = (p: WorkoutFilters['period']) => {
    switch (p) {
      case 'daily':
        return {
          start: startOfDay(new Date()),
          end: endOfDay(new Date()),
        };
      case 'weekly':
        return {
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        };
      case 'monthly':
        return {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        };
      case 'yearly':
        return {
          start: startOfYear(new Date()),
          end: endOfYear(new Date()),
        };
      case 'custom':
        return {
          start: new Date(customDateRange.start),
          end: new Date(customDateRange.end),
        };
      default:
        return {
          start: new Date(0),
          end: new Date(),
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Time Period</h3>
        <div className="flex flex-wrap gap-3">
          {['all', 'daily', 'weekly', 'monthly', 'yearly', 'custom'].map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p as WorkoutFilters['period'])}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                period === p
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range */}
      {period === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Workout Types Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Workout Types</h3>
        <div className="flex flex-wrap gap-3">
          {workoutTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedTypes.includes(type)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 