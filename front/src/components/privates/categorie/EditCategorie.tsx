import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCategorie } from "@/hooks/private/categorieHook";
import { getCategorieFormConfig } from "@/components/Global/AllConfigField/categorieFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import * as z from "zod";

const categorieSchema = z.object({
  nomCategorie: z.string().min(1, "Le nom de la catégorie est requis"),
  description: z.string().optional(),
});

interface EditCategorieProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorie: any;
}

const EditCategorie = ({ open, onOpenChange, categorie }: EditCategorieProps) => {
  const { mutate, isPending } = useUpdateCategorie();
  const formConfig = getCategorieFormConfig();

  const onSubmit = (data: any) => {
    mutate(
      { id: categorie.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la catégorie
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={categorieSchema}
          defaultValues={{
            nomCategorie: categorie?.nomCategorie || "",
            description: categorie?.description || "",
          }}
          onSubmit={onSubmit}
          isLoading={isPending}
          submitText="Mettre à jour"
          loadingText="Mise à jour en cours..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategorie;
