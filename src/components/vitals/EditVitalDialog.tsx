"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VitalsFilters } from "./VitalsFilters";

interface Vital {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}

interface EditVitalDialogProps {
  vital: Vital;
  isOpen: boolean;
  onClose: () => void;
  onVitalUpdated: (updatedVital: Vital) => void;
  onVitalDeleted: (id: string) => void;
  currentFilters?: VitalsFilters;
}

const vitalTypes = [
  { type: "Blood Pressure", unit: "mmHg", hasSecondValue: true },
  { type: "Blood Sugar", unit: "mg/dL", hasSecondValue: false },
  { type: "BMI", unit: "kg/m²", hasSecondValue: false },
  { type: "Body Fat", unit: "%", hasSecondValue: false },
  { type: "Heart Rate", unit: "bpm", hasSecondValue: false },
  { type: "Oxygen Saturation", unit: "%", hasSecondValue: false },
  { type: "Resting Heart Rate", unit: "bpm", hasSecondValue: false },
  { type: "Temperature", unit: "°F", hasSecondValue: false },
  { type: "Waist Circumference", unit: "in", hasSecondValue: false },
  { type: "Weight", unit: "lbs", hasSecondValue: false },
] as const;

export default function EditVitalDialog({
  vital,
  isOpen,
  onClose,
  onVitalUpdated,
  onVitalDeleted,
  currentFilters,
}: EditVitalDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: vital.type,
    value: vital.value.toString(),
    value2: vital.value2?.toString() || "",
    notes: vital.notes || "",
  });

  const selectedVitalType = vitalTypes.find((vt) => vt.type === formData.type);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Reset value2 when type changes to one that doesn't need it
    if (name === "type") {
      const selectedType = vitalTypes.find((vt) => vt.type === value);
      if (selectedType) {
        setFormData((prev) => ({
          ...prev,
          type: value,
          // Reset value2 if the new type doesn't need it
          value2: selectedType.hasSecondValue ? prev.value2 : ""
        }));
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the unit from the selected vital type
      const selectedType = vitalTypes.find((vt) => vt.type === formData.type);
      if (!selectedType) {
        throw new Error("Invalid vital type");
      }

      const response = await fetch(`/api/vitals/${vital.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value),
          value2: formData.value2 ? parseFloat(formData.value2) : undefined,
          unit: selectedType.unit,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update vital");
      }

      const updatedVital = await response.json();
      onVitalUpdated(updatedVital);
      onClose();
    } catch (error) {
      console.error("Error updating vital:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/vitals/${vital.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vital");
      }

      onVitalDeleted(vital.id);
      onClose();
    } catch (error) {
      console.error("Error deleting vital:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Edit Vital</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-700 dark:text-gray-200">
                Type
              </Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {vitalTypes.map((vt) => (
                  <option key={vt.type} value={vt.type}>
                    {vt.type} ({vt.unit})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-gray-700 dark:text-gray-200">
                Value
              </Label>
              <Input
                id="value"
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                step="0.1"
                required
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {selectedVitalType?.hasSecondValue && (
              <div className="space-y-2">
                <Label htmlFor="value2" className="text-gray-700 dark:text-gray-200">
                  Second Value
                </Label>
                <Input
                  id="value2"
                  type="number"
                  name="value2"
                  value={formData.value2}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 dark:text-gray-200">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isLoading}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-white dark:bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-blue-600 text-white hover:from-indigo-700 hover:to-purple-700 dark:hover:bg-blue-700 transition-all duration-200"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this vital?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vital
              &quot;{vital.type}&quot; and remove it from your vitals list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 