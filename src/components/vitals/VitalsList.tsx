"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import AddVitalDialog from "./AddVitalDialog";
import EditVitalDialog from "./EditVitalDialog";
import VitalsMenu from "./VitalsMenu";
import { Button } from "@/components/ui/button";
import { Vital } from "@/types/vital";
import { useRouter } from "next/navigation";

interface VitalsListProps {
  vitals: Vital[];
}

// Define a type for the vital data returned from the API
interface ApiVital {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}

export default function VitalsList({ vitals: initialVitals }: VitalsListProps) {
  const router = useRouter();
  const [vitals, setVitals] = useState<Vital[]>(initialVitals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVital, setEditingVital] = useState<Vital | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Update local state when props change
  useEffect(() => {
    setVitals(initialVitals);
  }, [initialVitals]);

  const handleVitalAdded = (newVital: ApiVital) => {
    // Convert ApiVital to Vital
    const vital: Vital = {
      ...newVital,
      userId: "", // This will be filled by the server
      createdAt: newVital.recordedAt,
      updatedAt: newVital.recordedAt,
    };
    setVitals((prev) => [vital, ...prev]);
  };

  const handleVitalUpdated = (updatedVital: ApiVital) => {
    // Convert ApiVital to Vital
    const vital: Vital = {
      ...updatedVital,
      userId: "", // This will be filled by the server
      createdAt: updatedVital.recordedAt,
      updatedAt: updatedVital.recordedAt,
    };
    setVitals((prev) => 
      prev.map((v) => (v.id === vital.id ? vital : v))
    );
    // Refresh the page to ensure all data is in sync
    router.refresh();
  };

  const handleVitalDeleted = (deletedId: string) => {
    setVitals((prev) => prev.filter((vital) => vital.id !== deletedId));
    // Refresh the page to ensure all data is in sync
    router.refresh();
  };

  const filteredVitals = filter === "all" 
    ? vitals 
    : vitals.filter((vital) => vital.type === filter);

  const uniqueTypes = Array.from(new Set(vitals.map((vital) => vital.type)));

  return (
    <div className="space-y-6">
      <VitalsMenu
        onAddVital={() => setIsAddDialogOpen(true)}
        onFilterChange={setFilter}
        currentFilter={filter}
        availableTypes={uniqueTypes}
      />

      <div className="space-y-4">
        {filteredVitals.map((vital) => (
          <div
            key={vital.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/80 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {vital.type}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {format(new Date(vital.recordedAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setEditingVital(vital)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Edit
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-indigo-600 dark:text-blue-500">
                {vital.value}
                {vital.value2 ? `/${vital.value2}` : ""} {vital.unit}
              </p>
              {vital.notes && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {vital.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddVitalDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onVitalAdded={handleVitalAdded}
      />

      {editingVital && (
        <EditVitalDialog
          vital={editingVital}
          isOpen={!!editingVital}
          onClose={() => setEditingVital(null)}
          onVitalUpdated={handleVitalUpdated}
          onVitalDeleted={handleVitalDeleted}
        />
      )}
    </div>
  );
} 