import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGetContacts, useDeleteContact } from "@/hooks/private/contactHook";
import { DataTable } from "@/components/Global/Tables/CustomDateTable/DataTable";
import { useColumnVisibility } from "@/components/Global/Tables/sharedHook/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/Global/Tables/VisibleColumns/ColumnVisibilityMenu";
import { createActionCellRenderer } from "@/components/Global/Tables/ActionsCellRender/ActionCellRenderer";
import { CONTACT_COLUMN_LABELS, CONTACT_INITIAL_VISIBLE_COLUMNS } from "@/components/Global/Tables/ShowColumns/attributColums";
import ConfirmModal from "@/components/Global/Modal/ConfirModal";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import { ShareContactDialog } from "../share/ShareContactDialog";
import { Plus, Users } from "lucide-react";
import type { ColDef } from "ag-grid-community";
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import { usePermissions } from "@/hooks/usePermissions";

interface ContactAffiche {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  adresse?: string;
  organisation?: string;
  categorie?: { nomCategorie: string };
  createdAt: string;
}

const ListeContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactAffiche | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [contactToShare, setContactToShare] = useState<ContactAffiche | null>(null);

  const { data: contacts, isLoading, error } = useGetContacts();
  const { mutate: deleteContact } = useDeleteContact();
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
    deleteContact(selectedId, { onSuccess: closeConfirmModal });
  };

  const handleEdit = (contact: ContactAffiche) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleShare = (contact: ContactAffiche) => {
    setContactToShare(contact);
    setIsShareDialogOpen(true);
  };

  const getColumnDefinitions = useCallback(
    (visibleColumns: Record<string, boolean>) => {
      const columns: (ColDef<ContactAffiche> | false)[] = [
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
          valueFormatter: ({ value }) => value || "—",
        },
        visibleColumns.telephone && {
          field: "telephone",
          headerName: "Téléphone",
        },
        visibleColumns.adresse && {
          field: "adresse",
          headerName: "Adresse",
          valueFormatter: ({ value }) => value || "—",
        },
        visibleColumns.categorie && {
          field: "categorie.nomCategorie",
          headerName: "Catégorie",
          valueGetter: ({ data }) => data?.categorie?.nomCategorie || "—",
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
          cellRenderer: createActionCellRenderer<ContactAffiche>({
            onEdit: hasPermission('contact.update') ? (data) => handleEdit(data) : undefined,
            onDelete: hasPermission('contact.delete') ? (data) => openConfirmModal(data.id) : undefined,
            onShare: hasPermission('SharedContact.create') ? (data) => handleShare(data) : undefined,
          }),
          sortable: false,
          filter: false,
          width: 120,
          pinned: "right",
        },
      ];

      return columns.filter(Boolean) as ColDef<ContactAffiche>[];
    },
    []
  );

  const { visibleColumns, toggleColumnVisibility, colDefs } =
    useColumnVisibility({
      initialColumns: CONTACT_INITIAL_VISIBLE_COLUMNS,
      columnDefinitions: getColumnDefinitions,
    });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">
              Gérez vos contacts professionnels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ColumnVisibilityMenu
              visibleColumns={visibleColumns}
              columnLabels={CONTACT_COLUMN_LABELS}
              onToggle={toggleColumnVisibility}
            />

            <ProtectedAction permission="contact.create" hideIfNoAccess>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contact
              </Button>
            </ProtectedAction>
          </div>
        </div>

        <DataTable<ContactAffiche>
          data={contacts || []}
          columnDefs={colDefs}
          isLoading={isLoading}
          error={error}
          emptyStateConfig={{
            icon: <Users className="h-8 w-8 text-muted-foreground" />,
            title: "Aucun contact",
            description: "Commencez par ajouter votre premier contact",
            action: (
              <ProtectedAction permission="contact.create" hideIfNoAccess>
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un contact
                </Button>
              </ProtectedAction>
            ),
          }}
          statsLabel="contact(s)"
          height={600}
        />
      </div>

      <AddContact open={isOpen} onOpenChange={setIsOpen} />

      {selectedContact && (
        <EditContact
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          contact={selectedContact}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeConfirmModal}
      />

      {contactToShare && (
        <ShareContactDialog
          contact={contactToShare as any}
          open={isShareDialogOpen}
          onClose={() => {
            setIsShareDialogOpen(false);
            setContactToShare(null);
          }}
        />
      )}
    </>
  );
};

export default ListeContact;
