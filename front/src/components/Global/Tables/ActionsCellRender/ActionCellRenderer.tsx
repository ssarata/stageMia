import { MoreVertical, Pencil, Trash, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ActionCellRendererProps<T> {
  data: T;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onShare?: (data: T) => void;
  customActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (data: T) => void;
    className?: string;
  }>;
}

export function ActionCellRenderer<T extends { id: number | string }>({
  data,
  onEdit,
  onDelete,
  onShare,
  customActions = []
}: ActionCellRendererProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onEdit && (
          <DropdownMenuItem
            onClick={() => onEdit(data)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
        )}

        {onShare && (
          <DropdownMenuItem
            onClick={() => onShare(data)}
            className="cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </DropdownMenuItem>
        )}

        {customActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(data)}
            className={`cursor-pointer ${action.className || ""}`}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}

        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(data)}
            className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createActionCellRenderer<T extends { id: number | string }>(
  options: Omit<ActionCellRendererProps<T>, 'data'>
) {
  return ({ data }: { data: T }) => (
    <ActionCellRenderer data={data} {...options} />
  );
}
