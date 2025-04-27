"use client";

import { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import AddVitalDialog from "./AddVitalDialog";
import EditVitalDialog from "./EditVitalDialog";
import VitalsFilters, { VitalsFilters as VitalsFiltersType } from "./VitalsFilters";
import { Button } from "@/components/ui/button";
import { Vital } from "@/types/vital";
import { useRouter } from "next/navigation";
import { defaultVitalTypes } from "./AddVitalDialog";

interface VitalsListProps {
  vitals: Vital[];
}

export default function VitalsList({ vitals: initialVitals }: VitalsListProps) {
  const router = useRouter();
  const [vitals, setVitals] = useState<Vital[]>(initialVitals);
  const [filteredVitals, setFilteredVitals] = useState<Vital[]>(initialVitals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVital, setEditingVital] = useState<Vital | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<VitalsFiltersType>({
    dateRange: {
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
    },
    types: [],
    period: 'daily',
  });

  // Update local state when props change
  useEffect(() => {
    setVitals(initialVitals);
    
    // Check if we have saved filters in localStorage
    const savedFilters = localStorage.getItem('vitalsFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        // Convert string dates back to Date objects
        parsedFilters.dateRange.start = new Date(parsedFilters.dateRange.start);
        parsedFilters.dateRange.end = new Date(parsedFilters.dateRange.end);
        
        // Apply the saved filters to the new data
        let filtered = initialVitals;

        // Filter by date range
        filtered = filtered.filter(vital => {
          const vitalDate = new Date(vital.recordedAt);
          return vitalDate >= parsedFilters.dateRange.start && vitalDate <= parsedFilters.dateRange.end;
        });

        // Filter by vital types if any are selected
        if (parsedFilters.types.length > 0) {
          filtered = filtered.filter(vital => parsedFilters.types.includes(vital.type));
        }

        setFilteredVitals(filtered);
        setCurrentFilters(parsedFilters);
      } catch (error) {
        console.error('Error parsing saved filters:', error);
        // Fall back to default daily filter if there's an error
        applyDefaultDailyFilter(initialVitals);
      }
    } else {
      // Apply default daily filter if no saved filters
      applyDefaultDailyFilter(initialVitals);
    }
  }, [initialVitals]);

  // Helper function to apply default daily filter
  const applyDefaultDailyFilter = (vitals: Vital[]) => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    
    const filtered = vitals.filter(vital => {
      const vitalDate = new Date(vital.recordedAt);
      return vitalDate >= startOfToday && vitalDate <= endOfToday;
    });
    
    setFilteredVitals(filtered);
    setCurrentFilters({
      dateRange: {
        start: startOfToday,
        end: endOfToday,
      },
      types: [],
      period: 'daily',
    });
  };

  const handleVitalAdded = (newVital: Partial<Vital>) => {
    // Convert the new vital to the correct format
    const vital: Vital = {
      ...newVital,
      userId: newVital.userId || "",
      createdAt: newVital.createdAt || newVital.recordedAt || new Date().toISOString(),
      updatedAt: newVital.updatedAt || newVital.recordedAt || new Date().toISOString(),
      recordedAt: newVital.recordedAt || new Date().toISOString(),
      id: newVital.id || "",
      type: newVital.type || "",
      value: newVital.value || 0,
      unit: newVital.unit || "",
    };
    setVitals((prev) => [vital, ...prev]);
    setFilteredVitals((prev) => [vital, ...prev]);
  };

  const handleVitalUpdated = (updatedVital: Partial<Vital>) => {
    // Convert the updated vital to the correct format
    const vital: Vital = {
      ...updatedVital,
      userId: updatedVital.userId || "",
      createdAt: updatedVital.createdAt || updatedVital.recordedAt || new Date().toISOString(),
      updatedAt: updatedVital.updatedAt || updatedVital.recordedAt || new Date().toISOString(),
      recordedAt: updatedVital.recordedAt || new Date().toISOString(),
      id: updatedVital.id || "",
      type: updatedVital.type || "",
      value: updatedVital.value || 0,
      unit: updatedVital.unit || "",
    };
    
    // Update the vitals state
    setVitals((prev) => 
      prev.map((v) => (v.id === vital.id ? vital : v))
    );
    
    // Apply current filters to the updated data
    let filtered = vitals.map((v) => (v.id === vital.id ? vital : v));
    
    // Filter by date range
    filtered = filtered.filter(vital => {
      const vitalDate = new Date(vital.recordedAt);
      return vitalDate >= currentFilters.dateRange.start && vitalDate <= currentFilters.dateRange.end;
    });

    // Filter by vital types if any are selected
    if (currentFilters.types.length > 0) {
      filtered = filtered.filter(vital => currentFilters.types.includes(vital.type));
    }
    
    setFilteredVitals(filtered);
    
    // No need to refresh the page since we're handling the update locally
    // router.refresh();
  };

  const handleVitalDeleted = (deletedId: string) => {
    // Update the vitals state
    setVitals((prev) => prev.filter((vital) => vital.id !== deletedId));
    
    // Apply current filters to the updated data
    let filtered = vitals.filter((vital) => vital.id !== deletedId);
    
    // Filter by date range
    filtered = filtered.filter(vital => {
      const vitalDate = new Date(vital.recordedAt);
      return vitalDate >= currentFilters.dateRange.start && vitalDate <= currentFilters.dateRange.end;
    });

    // Filter by vital types if any are selected
    if (currentFilters.types.length > 0) {
      filtered = filtered.filter(vital => currentFilters.types.includes(vital.type));
    }
    
    setFilteredVitals(filtered);
    
    // No need to refresh the page since we're handling the deletion locally
    // router.refresh();
  };

  const handleFilterChange = (filters: VitalsFiltersType) => {
    // Update the current filters state
    setCurrentFilters(filters);
    
    // Save filters to localStorage for persistence
    localStorage.setItem('vitalsFilters', JSON.stringify(filters));
    
    // Apply filters to the data
    let filtered = vitals;

    // Filter by date range
    filtered = filtered.filter(vital => {
      const vitalDate = new Date(vital.recordedAt);
      return vitalDate >= filters.dateRange.start && vitalDate <= filters.dateRange.end;
    });

    // Filter by vital types if any are selected
    if (filters.types.length > 0) {
      filtered = filtered.filter(vital => filters.types.includes(vital.type));
    }

    setFilteredVitals(filtered);
  };

  // Get unique vital types from the vitals data
  const uniqueTypes = vitals.length > 0 
    ? Array.from(new Set(vitals.map((vital) => vital.type)))
    : defaultVitalTypes.map(t => t.type);

  // Group vitals by date
  const vitalsByDate = filteredVitals.reduce((groups, vital) => {
    const date = format(new Date(vital.recordedAt), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(vital);
    return groups;
  }, {} as Record<string, typeof filteredVitals>);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-indigo-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            All Vitals
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Your complete health metrics history and progress overview.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <VitalsFilters
            vitalTypes={uniqueTypes}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Log New Vital Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300"
          >
            Log New Vital
          </Button>
        </div>

        {/* Vitals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vitals</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {filteredVitals.length}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vital Types</h3>
            <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {uniqueTypes.length}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Range</h3>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {filteredVitals.length > 0 
                ? `${format(new Date(filteredVitals[filteredVitals.length - 1].recordedAt), "MMM d, yyyy")} - ${format(new Date(filteredVitals[0].recordedAt), "MMM d, yyyy")}`
                : "No data"
              }
            </p>
          </div>
        </div>

        {/* Vitals List */}
        <div className="space-y-8">
          {Object.entries(vitalsByDate).map(([date, dateVitals]) => (
            <div key={date} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{date}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dateVitals.length} vital{dateVitals.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateVitals.map((vital) => (
                  <div
                    key={vital.id}
                    className={`p-8 transition-all duration-300 relative ${
                      editingVital?.id === vital.id
                        ? "bg-purple-50/90 dark:bg-purple-900/80"
                        : "hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/80 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    {editingVital?.id === vital.id && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-fuchsia-100 to-pink-100 dark:from-purple-800 dark:via-fuchsia-800 dark:to-pink-800 opacity-80 dark:opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-fuchsia-200/30 to-pink-200/30 dark:from-purple-600/40 dark:via-fuchsia-600/40 dark:to-pink-600/40 animate-pulse" />
                      </>
                    )}
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className={`text-lg font-medium transition-colors duration-300 ${
                            editingVital?.id === vital.id
                              ? "text-indigo-700 dark:text-indigo-400"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {vital.type}
                          </h3>
                          <Button
                            variant={editingVital?.id === vital.id ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setEditingVital(vital)}
                            className={`h-8 w-8 transition-all duration-300 ${
                              editingVital?.id === vital.id
                                ? "bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                                : ""
                            }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-colors duration-300 ${
                              editingVital?.id === vital.id
                                ? "text-indigo-700 dark:text-indigo-400"
                                : ""
                            }`}>
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                            </svg>
                          </Button>
                        </div>
                        {vital.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{vital.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                        <p className={`text-sm transition-colors duration-300 ${
                          editingVital?.id === vital.id
                            ? "text-indigo-700 dark:text-indigo-400"
                            : "text-gray-900 dark:text-white"
                        }`}>
                          {format(new Date(vital.recordedAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="relative z-10 mt-6">
                      <p className={`text-2xl font-bold transition-colors duration-300 ${
                        editingVital?.id === vital.id
                          ? "text-indigo-700 dark:text-indigo-400"
                          : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                      }`}>
                        {vital.value}{vital.value2 ? `/${vital.value2}` : ""} {vital.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(vitalsByDate).length === 0 && (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No vitals found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or add a new vital.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vital Dialog */}
      <AddVitalDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onVitalAdded={handleVitalAdded}
        vitalTypes={uniqueTypes}
      />

      {/* Edit Vital Dialog */}
      {editingVital && (
        <EditVitalDialog
          vital={editingVital}
          isOpen={!!editingVital}
          onClose={() => setEditingVital(null)}
          onVitalUpdated={handleVitalUpdated}
          onVitalDeleted={handleVitalDeleted}
          currentFilters={currentFilters}
        />
      )}
    </div>
  );
} 