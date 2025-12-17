import { useMemo, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import { useTheme } from "@/components/providers/theme-provider";
import type { ColDef, GridOptions } from "ag-grid-community";
import { Users } from "lucide-react";
import animationData from '../../../../assets/lottie/loading.json';
import Lottie from 'lottie-react';


interface DataTableProps<T> {
  data: T[] | undefined;
  columnDefs: ColDef<T>[];
  isLoading?: boolean;
  error?: Error | null;
  emptyStateConfig?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  gridOptions?: GridOptions<T>;
  height?: number;
  rowHeight?: number;
  headerHeight?: number;
  paginationPageSize?: number;
  showStats?: boolean;
  statsLabel?: string;
}

export function DataTable<T>({
  data,
  columnDefs,
  isLoading = false,
  error = null,
  emptyStateConfig,
  gridOptions = {},
  height = 600,
  rowHeight = 52,
  headerHeight = 48,
  paginationPageSize = 25,
  showStats = true,
  statsLabel = "élément(s)",
}: DataTableProps<T>) {
  const { theme } = useTheme();

  //délai minimum de 3 secondes
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;


    if (isLoading) {
      setShowLoader(true);
    } else {
      timer = setTimeout(() => setShowLoader(false), 500); 
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const customTheme = useMemo(() => {
    if (theme === "dark") {
      return themeQuartz.withParams({
        backgroundColor: "hsl(222.2 84% 4.9%)",
        foregroundColor: "hsl(210 40% 98%)",
        browserColorScheme: "dark",
        headerBackgroundColor: "hsl(217.2 32.6% 17.5%)",
        headerFontSize: 14,
        headerFontWeight: 600,
        oddRowBackgroundColor: "hsl(222.2 84% 4.9%)",
        rowHoverColor: "hsl(217.2 32.6% 17.5%)",
        borderColor: "hsl(217.2 32.6% 17.5%)",
        wrapperBorderRadius: "0.5rem",
        spacing: 8,
      });
    }

    return themeQuartz.withParams({
      backgroundColor: "hsl(0 0% 100%)",
      foregroundColor: "hsl(222.2 84% 4.9%)",
      browserColorScheme: "light",
      headerBackgroundColor: "hsl(210 40% 96.1%)",
      headerFontSize: 14,
      headerFontWeight: 600,
      oddRowBackgroundColor: "hsl(0 0% 100%)",
      rowHoverColor: "hsl(210 40% 96.1%)",
      borderColor: "hsl(214.3 31.8% 91.4%)",
      wrapperBorderRadius: "0.5rem",
      spacing: 8,
    });
  }, [theme]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
     
      
      filterParams: {
        suppressAndOrCondition: true,
        debounceMs: 200,
      },
    }),
    []
  );

  // on utilise showLoader au lieu de isLoading
  if (showLoader) {
    return (
      // <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      //   <div className="text-center space-y-4">
      //     <GridLoader
      //       color={theme === "dark" ? "#ffffff" : "#000000"}
      //       size={40}
      //     />
      //     <p className="text-sm text-muted-foreground">
      //       Chargement des données...
      //     </p>
      //   </div>
      // </div>

      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="text-center space-y-4">
        <Lottie 
          animationData={animationData}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
        <p className="text-sm text-muted-foreground">
          Chargement des données...
        </p>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-destructive">
            Erreur de chargement
          </p>
          <p className="text-sm text-muted-foreground">
            Impossible de charger les données
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showStats && data && data.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <div className="flex items-center gap-2">
            <Users /> : <span className="font-medium text-foreground">{data.length}</span> {statsLabel}
          </div>
        </div>
      )}
      <div className="rounded-lg border bg-card">
        {data?.length ? (
          <div style={{ height, width: "100%" }}>
            <AgGridReact<T>
              theme={customTheme}
              rowData={data}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              rowHeight={rowHeight}
              headerHeight={headerHeight}
              animateRows
              enableCellTextSelection
              ensureDomOrder
              {...gridOptions}
            />
          </div>
        ) : (
          emptyStateConfig && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
              <div className="rounded-full bg-muted p-4 mb-4">
                {emptyStateConfig.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {emptyStateConfig.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {emptyStateConfig.description}
              </p>
              {emptyStateConfig.action}
            </div>
          )
        )}
      </div>
    </div>
  );
}
