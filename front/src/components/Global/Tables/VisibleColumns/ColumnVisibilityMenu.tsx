import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ColumnVisibilityMenuProps {
  visibleColumns: Record<string, boolean>;
  columnLabels: Record<string, string>;
  onToggle: (columnKey: string) => void;
}

export function ColumnVisibilityMenu({
  visibleColumns,
  columnLabels,
  onToggle
}: ColumnVisibilityMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-sm font-semibold">
          Colonnes visibles
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <DropdownMenuItem 
              key={key} 
              className="flex items-center justify-between cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <span className="text-sm">{columnLabels[key] || key}</span>
              <Switch 
                checked={visible} 
                onCheckedChange={() => onToggle(key)}
                onClick={(e) => e.stopPropagation()}
              />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
