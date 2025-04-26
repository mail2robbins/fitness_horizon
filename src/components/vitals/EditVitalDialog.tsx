"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

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

export default function EditVitalDialog({
  vital,
  isOpen,
  onClose,
  onVitalUpdated,
  onVitalDeleted,
}: EditVitalDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch(`/api/vitals/${vital.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value),
          value2: formData.value2 ? parseFloat(formData.value2) : undefined,
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
    if (!confirm("Are you sure you want to delete this vital?")) {
      return;
    }

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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Vital
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full"
            >
              {vitalTypes.map((vt) => (
                <option key={vt.type} value={vt.type}>
                  {vt.type}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Value
            </label>
            <Input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              step="0.1"
              required
              className="w-full"
            />
          </div>

          {selectedVitalType?.hasSecondValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Second Value
              </label>
              <Input
                type="number"
                name="value2"
                value={formData.value2}
                onChange={handleInputChange}
                step="0.1"
                required
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 