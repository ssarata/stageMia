import { useAuthStore } from "../store/authStore";
import { useMemo } from "react";

/**
 * Hook personnalisé pour gérer les permissions et rôles
 * Basé sur le système RBAC (Role-Based Access Control)
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (roleName: string): boolean => {
    return user?.role?.nomRole === roleName;
  };

  // Vérifier si l'utilisateur a l'un des rôles listés
  const hasAnyRole = (roleNames: string[]): boolean => {
    return user?.role?.nomRole ? roleNames.includes(user.role.nomRole) : false;
  };

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permissionKey: string): boolean => {
    const permissions = user?.role?.permissions || [];
    return permissions.some((perm) => perm.nomPermission === permissionKey);
  };

  // Vérifier si l'utilisateur a au moins une des permissions listées
  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    const permissions = user?.role?.permissions || [];
    return permissionKeys.some((key) =>
      permissions.some((perm) => perm.nomPermission === key)
    );
  };

  // Vérifier si l'utilisateur a toutes les permissions listées
  const hasAllPermissions = (permissionKeys: string[]): boolean => {
    const permissions = user?.role?.permissions || [];
    return permissionKeys.every((key) =>
      permissions.some((perm) => perm.nomPermission === key)
    );
  };

  // Raccourcis pour les rôles communs
  const isAdmin = useMemo(() => hasRole("ADMIN"), [user]);
  const isMIA = useMemo(() => hasRole("MIA"), [user]);
  const isLecteur = useMemo(() => hasRole("LECTEUR"), [user]);
  const isAdminOrMIA = useMemo(() => isAdmin || isMIA, [isAdmin, isMIA]);

  // Vérifier les permissions CRUD pour une ressource
  const canCreate = (resource: string): boolean => hasPermission(`${resource}.create`);
  const canRead = (resource: string): boolean => hasPermission(`${resource}.read`);
  const canUpdate = (resource: string): boolean => hasPermission(`${resource}.update`);
  const canDelete = (resource: string): boolean => hasPermission(`${resource}.delete`);

  return {
    // Fonctions de vérification de rôles
    hasRole,
    hasAnyRole,
    isAdmin,
    isMIA,
    isLecteur,
    isAdminOrMIA,

    // Fonctions de vérification de permissions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Helpers CRUD
    canCreate,
    canRead,
    canUpdate,
    canDelete,

    // Info utilisateur
    currentRole: user?.role?.nomRole,
    permissions: user?.role?.permissions || [],
  };
};
