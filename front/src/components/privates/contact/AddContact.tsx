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
import { contactFormSchema } from "@/validators/allSchema";
import { CONTACT_FORM_DEFAULTS as DEFAULTS } from "@/components/Global/ResetField/resetField";

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
          schema={contactFormSchema}
          defaultValues={DEFAULTS}
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
