"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Vital {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}

export default function AllVitalsPage() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch("/api/vitals");
        if (!response.ok) {
          throw new Error("Failed to fetch vitals");
        }
        const data = await response.json();
        setVitals(data);
      } catch (error) {
        console.error("Error fetching vitals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitals();
  }, []);

  const getVitalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "blood pressure":
        return "🫀";
      case "heart rate":
        return "💓";
      case "weight":
        return "⚖️";
      case "blood sugar":
        return "🩸";
      case "temperature":
        return "🌡️";
      case "oxygen saturation":
        return "💨";
      default:
        return "📊";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
              All Vitals
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Track and manage your health vitals
            </p>
          </div>
          <LoadingSpinner title="Vitals" subtitle="Loading your complete health vitals history..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            All Vitals
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Track and manage your health vitals
          </p>
        </div>

        {vitals.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <CardContent className="p-6">
              <p className="text-center text-gray-600 dark:text-gray-300">
                No vitals recorded yet. Add your first vital to start tracking!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.map((vital) => (
              <Card
                key={vital.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {vital.type}
                    </CardTitle>
                    <span className="text-2xl">{getVitalIcon(vital.type)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      {vital.value}
                      {vital.value2 ? `/${vital.value2}` : ""} {vital.unit}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(vital.recordedAt), "MMMM d, yyyy h:mm a")}
                    </p>
                    {vital.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {vital.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 