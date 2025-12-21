import { useState, useCallback, useMemo } from "react";
import { UserPlus, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/Global/Modal/ConfirModal";
import { useGetUsers, useDeleteUser } from "@/hooks/private/userHook";
import type { ColDef } from "ag-grid-community";
import { createRoleBadgeCellRenderer } from "@/components/Global/shared/RoleBadgeRenderer";
import { createActionCellRenderer } from "@/components/Global/Tables/ActionsCellRender/ActionCellRenderer";
import { useColumnVisibility } from "@/components/Global/Tables/sharedHook/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/Global/Tables/VisibleColumns/ColumnVisibilityMenu";
import { DataTable } from "@/components/Global/Tables/CustomDateTable/DataTable";
import { USER_COLUMN_LABELS, USER_INITIAL_VISIBLE_COLUMNS } from "../../Global/Tables/ShowColumns/attributColums";
import EditUser from "./EditUser";
import AssignRoleDialog from "./AssignRoleDialog";
import { AdminOnly } from "@/components/Global/ProtectedAction";
import { usePermissions } from "@/hooks/usePermissions";

// Interface définie localement
interface Useraffiche {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role?: {
    nomRole: string;
  };
  createdAt: string;
}

const ListeUsers = () => {
  const { data, isLoading, error } = useGetUsers();

  // Afficher tous les utilisateurs (y compris les admins)
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const { mutate: deleteUser } = useDeleteUser();
  const { hasPermission, isAdmin } = usePermissions();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Useraffiche | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);

  const openConfirmModal = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteUser(selectedId, { onSuccess: closeConfirmModal });
  };

  const handleEdit = (user: Useraffiche) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleAssignRole = (user: Useraffiche) => {
    setSelectedUser(user);
    setIsAssignRoleModalOpen(true);
  };

  //colonnes
  const getColumnDefinitions = useCallback(
    (visibleColumns: Record<string, boolean>) => {
      const columns: (ColDef<Useraffiche> | false)[] = [
        visibleColumns.nom && {
          field: "nom",
          headerName: "Nom",
          cellClass: "font-medium",
        },
        visibleColumns.prenom && {
          field: "prenom",
          headerName: "Prénom",
          cellClass: "font-medium",
        },
        visibleColumns.email && {
          field: "email",
          headerName: "Email",
        },
        visibleColumns.telephone && {
          field: "telephone",
          headerName: "Téléphone",
          valueFormatter: ({ value }) => value || "—",
        },
        visibleColumns.role && {
          field: "role.nomRole",
          headerName: "Rôle",
          cellRenderer: createRoleBadgeCellRenderer<Useraffiche>(
            (data) => data?.role?.nomRole || "N/A"
          ),
        },
        visibleColumns.createdAt && {
          field: "createdAt",
          headerName: "Date de création",
          valueFormatter: ({ value }) =>
            new Date(value).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
        },
        visibleColumns.actions && {
          headerName: "Actions",
          cellRenderer: createActionCellRenderer<Useraffiche>({
            onEdit: hasPermission('user.update') ? (data) => handleEdit(data) : undefined,
            onDelete: hasPermission('user.delete') ? (data) => openConfirmModal(data.id) : undefined,
            customActions: isAdmin ? [
              {
                label: "Attribuer un rôle",
                icon: <UserCog className="mr-2 h-4 w-4" />,
                onClick: (data) => handleAssignRole(data),
              },
            ] : [],
          }),
          sortable: false,
          filter: false,
          width: 80,
          pinned: "right",
        },
      ];

      return columns.filter(Boolean) as ColDef<Useraffiche>[];
    },
    []
  );

  const { visibleColumns, toggleColumnVisibility, colDefs } =
    useColumnVisibility({
      initialColumns: USER_INITIAL_VISIBLE_COLUMNS,
      columnDefinitions: getColumnDefinitions,
    });

  return (
    <>
      <div className="space-y-4">
        {/* Header avec menu colonnes */}
        <div className="flex items-center justify-end">
          <ColumnVisibilityMenu
            visibleColumns={visibleColumns}
            columnLabels={USER_COLUMN_LABELS}
            onToggle={toggleColumnVisibility}
          />
        </div>

        {/* Table réutilisable avec données filtrées */}
        <DataTable<Useraffiche>
          data={filteredData}
          columnDefs={colDefs}
          isLoading={isLoading}
          error={error}
          emptyStateConfig={{
            icon: <UserPlus className="h-8 w-8 text-muted-foreground" />,
            title: "Aucun utilisateur",
            description: "Commencez par ajouter votre premier utilisateur",
            action: (
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            ),
          }}
          statsLabel="utilisateur(s)"
          height={600}
        />
      </div>

      {selectedUser && (
        <>
          <EditUser
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            user={selectedUser}
          />
          <AdminOnly hideIfNoAccess>
            <AssignRoleDialog
              open={isAssignRoleModalOpen}
              onOpenChange={setIsAssignRoleModalOpen}
              user={selectedUser}
            />
          </AdminOnly>
        </>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeConfirmModal}
      />
    </>
  );
};

export default ListeUsers;