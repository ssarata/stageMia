import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGetCategories, useDeleteCategorie } from "@/hooks/private/categorieHook";
import { DataTable } from "@/components/Global/Tables/CustomDateTable/DataTable";
import { useColumnVisibility } from "@/components/Global/Tables/sharedHook/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/Global/Tables/VisibleColumns/ColumnVisibilityMenu";
import { createActionCellRenderer } from "@/components/Global/Tables/ActionsCellRender/ActionCellRenderer";
import { CATEGORIE_COLUMN_LABELS, CATEGORIE_INITIAL_VISIBLE_COLUMNS } from "@/components/Global/Tables/ShowColumns/attributColums";
import ConfirmModal from "@/components/Global/Modal/ConfirModal";
import AddCategorie from "./AddCategorie";
import EditCategorie from "./EditCategorie";
import { Plus, FolderOpen } from "lucide-react";
import type { ColDef } from "ag-grid-community";
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import { usePermissions } from "@/hooks/usePermissions";

interface CategorieAffiche {
  id: number;
  nomCategorie: string;
  description?: string;
  contactCount?: number;
  _count?: { contacts: number };
  createdAt: string;
}

const ListeCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<CategorieAffiche | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: categories, isLoading, error } = useGetCategories();
  const { mutate: deleteCategorie } = useDeleteCategorie();
  const { hasPermission } = usePermissions();

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
    deleteCategorie(selectedId, { onSuccess: closeConfirmModal });
  };

  const handleEdit = (categorie: CategorieAffiche) => {
    setSelectedCategorie(categorie);
    setIsEditModalOpen(true);
  };

  const getColumnDefinitions = useCallback(
    (visibleColumns: Record<string, boolean>) => {
      const columns: (ColDef<CategorieAffiche> | false)[] = [
        visibleColumns.nomCategorie && {
          field: "nomCategorie",
          headerName: "nomCategorie",
          cellClass: "font-medium",
        },
        visibleColumns.description && {
          field: "description",
          headerName: "Description",
          valueFormatter: ({ value }) => value || "—",
        },
        visibleColumns.contactCount && {
          field: "_count.contacts",
          headerName: "Nombre de contacts",
          valueGetter: ({ data }) => data?._count?.contacts || 0,
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
          cellRenderer: createActionCellRenderer<CategorieAffiche>({
            onEdit: hasPermission('categorie.update') ? (data) => handleEdit(data) : undefined,
            onDelete: hasPermission('categorie.delete') ? (data) => openConfirmModal(data.id) : undefined,
          }),
          sortable: false,
          filter: false,
          width: 80,
          pinned: "right",
        },
      ];

      return columns.filter(Boolean) as ColDef<CategorieAffiche>[];
    },
    []
  );

  const { visibleColumns, toggleColumnVisibility, colDefs } =
    useColumnVisibility({
      initialColumns: CATEGORIE_INITIAL_VISIBLE_COLUMNS,
      columnDefinitions: getColumnDefinitions,
    });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Catégories</h1>
            <p className="text-muted-foreground">
              Gérez vos catégories de contacts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ColumnVisibilityMenu
              visibleColumns={visibleColumns}
              columnLabels={CATEGORIE_COLUMN_LABELS}
              onToggle={toggleColumnVisibility}
            />

            <ProtectedAction permission="categorie.create" hideIfNoAccess>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle catégorie
              </Button>
            </ProtectedAction>
          </div>
        </div>

        <DataTable<CategorieAffiche>
          data={categories || []}
          columnDefs={colDefs}
          isLoading={isLoading}
          error={error}
          emptyStateConfig={{
            icon: <FolderOpen className="h-8 w-8 text-muted-foreground" />,
            title: "Aucune catégorie",
            description: "Commencez par créer votre première catégorie",
            action: (
              <ProtectedAction permission="categorie.create" hideIfNoAccess>
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une catégorie
                </Button>
              </ProtectedAction>
            ),
          }}
          statsLabel="catégorie(s)"
          height={600}
        />
      </div>

      <AddCategorie open={isOpen} onOpenChange={setIsOpen} />

      {selectedCategorie && (
        <EditCategorie
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          categorie={selectedCategorie}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeConfirmModal}
      />
    </>
  );
};

export default ListeCategories;
