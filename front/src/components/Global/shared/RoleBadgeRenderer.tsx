import { Badge } from "@/components/ui/badge";

interface RoleBadgeConfig {
  colorClasses: Record<string, string>;
  defaultColor?: string;
}

const defaultRoleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  DIRECTEUR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  ENSEIGNANT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PARENT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  ELEVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

interface RoleBadgeRendererProps {
  roleName: string;
  config?: RoleBadgeConfig;
}

export function RoleBadgeRenderer({ 
  roleName, 
  config 
}: RoleBadgeRendererProps) {
  const roleColors = config?.colorClasses || defaultRoleColors;
  const defaultColor = config?.defaultColor || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  const colorClass = roleColors[roleName] || defaultColor;

  return (
    <Badge variant="outline" className={`${colorClass} font-medium`}>
      {roleName || "N/A"}
    </Badge>
  );
}

export function createRoleBadgeCellRenderer<T>(
  getRoleName: (data: T) => string,
  config?: RoleBadgeConfig
) {
  return ({ data }: { data: T }) => (
    <RoleBadgeRenderer roleName={getRoleName(data)} config={config} />
  );
}
