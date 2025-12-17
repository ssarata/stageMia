import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddContact } from "@/hooks/private/contactHook";
import { useGetCategories } from "@/hooks/private/categorieHook";
import { getContactFormConfig } from "@/components/Global/AllConfigField/contactFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import type { OpenProps } from "@/interfaces/interfaceTable";
import * as z from "zod";

const contactSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide").or(z.literal("")).optional(),
  telephone: z.string().min(1, "Le téléphone est requis"),
  adresse: z.string().optional(),
  organisation: z.string().optional(),
  categorieId: z.number().optional(),
});

const AddContact = ({ open, onOpenChange }: OpenProps) => {
  const { mutate, isPending } = useAddContact();
  const { data: categories } = useGetCategories();

  const formConfig = getContactFormConfig(categories || []);

  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un contact</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau contact à votre liste
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={contactSchema}
          defaultValues={{
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            adresse: "",
            organisation: "",
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

export default AddContact;
