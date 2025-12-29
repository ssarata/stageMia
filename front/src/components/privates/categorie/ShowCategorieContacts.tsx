import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/Global/Tables/CustomDateTable/DataTable";
import { useGetCategorieById } from "@/hooks/private/categorieHook";
import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { Users } from "lucide-react";

interface ShowCategorieContactsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorieId: number;
  categorieName: string;
}

interface ContactData {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  adresse?: string;
  fonction?: string;
  organisation?: string;
}

const ShowCategorieContacts = ({
  open,
  onOpenChange,
  categorieId,
  categorieName,
}: ShowCategorieContactsProps) => {
  const { data: categorie, isLoading, error } = useGetCategorieById(categorieId, open);

  const columnDefs = useMemo<ColDef<ContactData>[]>(
    () => [
      {
        field: "nom",
        headerName: "Nom",
        cellClass: "font-medium",
        flex: 1,
      },
      {
        field: "prenom",
        headerName: "Prénom",
        cellClass: "font-medium",
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        valueFormatter: ({ value }) => value || "—",
        flex: 1,
      },
      {
        field: "telephone",
        headerName: "Téléphone",
        flex: 1,
      },
      {
        field: "fonction",
        headerName: "Fonction",
        valueFormatter: ({ value }) => value || "—",
        flex: 1,
      },
      {
        field: "organisation",
        headerName: "Organisation",
        valueFormatter: ({ value }) => value || "—",
        flex: 1,
      },
    ],
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Contacts de la catégorie : {categorieName}</DialogTitle>
          <DialogDescription>
            Liste de tous les contacts appartenant à cette catégorie
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <DataTable<ContactData>
            data={categorie?.contacts || []}
            columnDefs={columnDefs}
            isLoading={isLoading}
            error={error}
            emptyStateConfig={{
              icon: <Users className="h-8 w-8 text-muted-foreground" />,
              title: "Aucun contact",
              description: "Cette catégorie ne contient aucun contact pour le moment",
            }}
            statsLabel="contact(s)"
            height={450}
            paginationPageSize={10}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowCategorieContacts;
