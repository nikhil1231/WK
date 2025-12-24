import { SheetData } from "./types";

/**
 * Converts a data object into a flat array for Google Sheets
 */
export const formatRowData = (data: SheetData): string[] => {
  return [data.name, data.email, data.timestamp];
};
