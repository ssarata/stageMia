import { type ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface ProtectedActionProps {
  children: ReactNode;
  /** Permission requise (ex: 'contact.create') */
  permission?: string;
  /** Liste de permissions (au moins une requise) */
  anyPermission?: string[];
  /** Liste de permissions (toutes requises) */
  allPermissions?: string[];
  /** Rôle requis (ex: 'ADMIN') */
  role?: string;
  /** Liste de rôles (au moins un requis) */
  anyRole?: string[];
  /** Composant à afficher si l'utilisateur n'a pas les permissions */
  fallback?: ReactNode;
  /** Si true, affiche rien au lieu du fallback */
  hideIfNoAccess?: boolean;
}

/**
 * Composant pour protéger l'affichage d'éléments UI (boutons, liens, etc.)
 * en fonction des rôles et permissions de l'utilisateur
 *
 * @example
 * // Vérifier une permission unique
 * <ProtectedAction permission="contact.create">
 *   <Button>Créer un contact</Button>
 * </ProtectedAction>
 *
 * @example
 * // Vérifier un rôle
 * <ProtectedAction role="ADMIN">
 *   <Button>Supprimer</Button>
 * </ProtectedAction>
 *
 * @example
 * // Vérifier au moins une permission
 * <ProtectedAction anyPermission={['contact.update', 'contact.delete']}>
 *   <Button>Modifier</Button>
 * </ProtectedAction>
 *
 * @example
 * // Cacher complètement si pas d'accès
 * <ProtectedAction permission="user.delete" hideIfNoAccess>
 *   <Button>Supprimer</Button>
 * </ProtectedAction>
 */
export const ProtectedAction = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  role,
  anyRole,
  fallback = null,
  hideIfNoAccess = false,
}: ProtectedActionProps) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermissions();

  // Vérifier les permissions
  let hasAccess = true;

  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(anyPermission);
  }

  if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(allPermissions);
  }

  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  if (anyRole && anyRole.length > 0) {
    hasAccess = hasAccess && hasAnyRole(anyRole);
  }

  // Si l'utilisateur n'a pas accès
  if (!hasAccess) {
    return hideIfNoAccess ? null : <>{fallback}</>;
  }

  return <>{children}</>;
};

// Composants helpers pour les cas courants
export const AdminOnly = ({ children, hideIfNoAccess = false }: { children: ReactNode; hideIfNoAccess?: boolean }) => (
  <ProtectedAction role="ADMIN" hideIfNoAccess={hideIfNoAccess}>
    {children}
  </ProtectedAction>
);

export const MIAOnly = ({ children, hideIfNoAccess = false }: { children: ReactNode; hideIfNoAccess?: boolean }) => (
  <ProtectedAction role="MIA" hideIfNoAccess={hideIfNoAccess}>
    {children}
  </ProtectedAction>
);

export const AdminOrMIA = ({ children, hideIfNoAccess = false }: { children: ReactNode; hideIfNoAccess?: boolean }) => (
  <ProtectedAction anyRole={["ADMIN", "MIA"]} hideIfNoAccess={hideIfNoAccess}>
    {children}
  </ProtectedAction>
);
