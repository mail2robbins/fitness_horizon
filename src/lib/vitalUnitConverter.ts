/**
 * Utility functions for converting vital measurements between metric and US units
 */

/**
 * Converts a vital's value from metric to US units
 * @param vital The vital object to convert
 * @returns A new vital object with converted values
 */
export function convertVitalToUSUnits(vital: {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}) {
  const { type, value, value2, unit } = vital;
  
  // Create a copy of the vital to avoid mutating the original
  const convertedVital = { ...vital };
  
  // Convert based on vital type
  switch (type.toLowerCase()) {
    case "weight":
      if (unit === "kg") {
        // Convert kg to lbs (1 kg = 2.20462 lbs)
        convertedVital.value = Number((value * 2.20462).toFixed(1));
        convertedVital.unit = "lbs";
      }
      break;
      
    case "waist circumference":
      if (unit === "cm") {
        // Convert cm to inches (1 cm = 0.393701 inches)
        convertedVital.value = Number((value * 0.393701).toFixed(1));
        convertedVital.unit = "in";
      }
      break;
      
    case "temperature":
      if (unit === "°C") {
        // Convert Celsius to Fahrenheit (°F = °C * 9/5 + 32)
        convertedVital.value = Number(((value * 9/5) + 32).toFixed(1));
        convertedVital.unit = "°F";
      }
      break;
      
    // Add more conversions as needed
  }
  
  return convertedVital;
}

/**
 * Converts a vital's value from US to metric units
 * @param vital The vital object to convert
 * @returns A new vital object with converted values
 */
export function convertVitalToMetricUnits(vital: {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}) {
  const { type, value, value2, unit } = vital;
  
  // Create a copy of the vital to avoid mutating the original
  const convertedVital = { ...vital };
  
  // Convert based on vital type
  switch (type.toLowerCase()) {
    case "weight":
      if (unit === "lbs") {
        // Convert lbs to kg (1 lb = 0.453592 kg)
        convertedVital.value = Number((value * 0.453592).toFixed(1));
        convertedVital.unit = "kg";
      }
      break;
      
    case "waist circumference":
      if (unit === "in") {
        // Convert inches to cm (1 inch = 2.54 cm)
        convertedVital.value = Number((value * 2.54).toFixed(1));
        convertedVital.unit = "cm";
      }
      break;
      
    case "temperature":
      if (unit === "°F") {
        // Convert Fahrenheit to Celsius (°C = (°F - 32) * 5/9)
        convertedVital.value = Number(((value - 32) * 5/9).toFixed(1));
        convertedVital.unit = "°C";
      }
      break;
      
    // Add more conversions as needed
  }
  
  return convertedVital;
} 