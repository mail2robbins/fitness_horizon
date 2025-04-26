import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    const handleCalendarClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.showPicker();
      }
    };

    return (
      <div className="relative">
        <input
          type="date"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0",
            className
          )}
          ref={ref}
          {...props}
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" 
          onClick={handleCalendarClick}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput }; 