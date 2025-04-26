"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddVitalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVitalAdded?: (newVital: {
    id: string;
    type: string;
    value: number;
    value2?: number;
    unit: string;
    notes?: string;
    recordedAt: string;
  }) => void;
}

const vitalTypes = [
  { type: "BMI", unit: "kg/m²", hasSecondValue: false },
  { type: "Blood Sugar", unit: "mg/dL", hasSecondValue: false },
  { type: "Blood Pressure", unit: "mmHg", hasSecondValue: true },
  { type: "Heart Rate", unit: "bpm", hasSecondValue: false },
  { type: "Weight", unit: "lbs", hasSecondValue: false },
  { type: "Body Fat", unit: "%", hasSecondValue: false },
  { type: "Waist Circumference", unit: "in", hasSecondValue: false },
  { type: "Resting Heart Rate", unit: "bpm", hasSecondValue: false },
  { type: "Oxygen Saturation", unit: "%", hasSecondValue: false },
  { type: "Temperature", unit: "°F", hasSecondValue: false },
] as const;

export default function AddVitalDialog({
  isOpen,
  onClose,
  onVitalAdded,
}: AddVitalDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: vitalTypes[0].type,
    value: "",
    value2: "",
    unit: vitalTypes[0].unit,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update unit when type changes
    if (name === "type") {
      const selectedType = vitalTypes.find((t) => t.type === value);
      if (selectedType) {
        setFormData((prev) => ({ ...prev, unit: selectedType.unit }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: Number(formData.value),
          value2: formData.value2 ? Number(formData.value2) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add vital");
      }

      const newVital = await response.json();
      
      if (onVitalAdded) {
        onVitalAdded(newVital);
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error adding vital:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = vitalTypes.find((t) => t.type === formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Add Health Vital</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Vital Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {vitalTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.type} ({type.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Value
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              step="0.1"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {selectedType?.hasSecondValue && (
            <div>
              <label
                htmlFor="value2"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Second Value (e.g., Diastolic for Blood Pressure)
              </label>
              <input
                type="number"
                id="value2"
                name="value2"
                value={formData.value2}
                onChange={handleChange}
                required
                step="0.1"
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-white dark:bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-blue-600 text-white hover:from-indigo-700 hover:to-purple-700 dark:hover:bg-blue-700 transition-all duration-200"
            >
              {isLoading ? "Adding..." : "Add Vital"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 