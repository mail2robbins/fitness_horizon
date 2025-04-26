"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MenuButton, MenuItem, MenuList } from "@/components/ui/menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface VitalsMenuProps {
  onAddVital: () => void;
  onFilterChange: (filter: string) => void;
  currentFilter: string;
  availableTypes: string[];
}

export default function VitalsMenu({
  onAddVital,
  onFilterChange,
  currentFilter,
  availableTypes,
}: VitalsMenuProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Menu>
          <MenuButton className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              {currentFilter === "all" ? "All Types" : currentFilter}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => onFilterChange("all")}>All Types</MenuItem>
            {availableTypes.map((type) => (
              <MenuItem key={type} onClick={() => onFilterChange(type)}>
                {type}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
      <Button
        onClick={onAddVital}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Add New Vital
      </Button>
    </div>
  );
} 