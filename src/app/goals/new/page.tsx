'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeProvider';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewGoal() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'weight',  // default type
    target: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal' },
    { value: 'workout', label: 'Workout Goal' },
    { value: 'nutrition', label: 'Nutrition Goal' },
    { value: 'steps', label: 'Steps Goal' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          target: parseInt(formData.target.toString()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      router.push('/goals');
      router.refresh();
    } catch (error) {
      console.error('Error creating goal:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!session) {
    return <LoadingSpinner title="Authentication" subtitle="Please sign in to continue..." fullScreen />;
  }

  if (isSubmitting) {
    return <LoadingSpinner title="Creating Goal" subtitle="Saving your new goal..." fullScreen />;
  }

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl pb-2 leading-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Create New Goal
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Set a new fitness goal to track your progress
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter goal title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Enter goal description"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Type
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {goalTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Value
            </label>
            <input
              type="number"
              id="target"
              name="target"
              required
              value={formData.target}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter target value"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 