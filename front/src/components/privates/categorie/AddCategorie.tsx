import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddCategorie } from "@/hooks/private/categorieHook";
import { getCategorieFormConfig } from "@/components/Global/AllConfigField/categorieFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import type { OpenProps } from "@/interfaces/interfaceTable";
import * as z from "zod";

const categorieSchema = z.object({
  nomCategorie: z.string().min(1, "Le nom de la catégorie est requis"),
  description: z.string().optional(),
});

const AddCategorie = ({ open, onOpenChange }: OpenProps) => {
  const { mutate, isPending } = useAddCategorie();
  const formConfig = getCategorieFormConfig();

  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer une catégorie</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle catégorie pour organiser vos contacts
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={categorieSchema}
          defaultValues={{
            nomCategorie: "",
            description: "",
          }}
          onSubmit={onSubmit}
          isLoading={isPending}
          submitText="Créer"
          loadingText="Création..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategorie;
