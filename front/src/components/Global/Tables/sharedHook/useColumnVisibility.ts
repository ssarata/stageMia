import { useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";

interface UseColumnVisibilityOptions<T> {
  initialColumns: Record<string, boolean>;
  columnDefinitions: (visibleColumns: Record<string, boolean>) => ColDef<T>[];
}

export function useColumnVisibility<T>({
  initialColumns,
  columnDefinitions,
}: UseColumnVisibilityOptions<T>) {
  const [visibleColumns, setVisibleColumns] =
    useState<Record<string, boolean>>(initialColumns);

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const colDefs = useMemo(() => {
    return columnDefinitions(visibleColumns);
  }, [visibleColumns, columnDefinitions]);

  return {
    visibleColumns,
    toggleColumnVisibility,
    colDefs,
  };
}
