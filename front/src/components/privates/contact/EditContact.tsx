import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateContact } from "@/hooks/private/contactHook";
import { useGetCategories } from "@/hooks/private/categorieHook";
import { getContactFormConfig } from "@/components/Global/AllConfigField/contactFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { contactFormSchema } from "@/validators/allSchema";

interface EditContactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: any;
}

const EditContact = ({ open, onOpenChange, contact }: EditContactProps) => {
  const { mutate, isPending } = useUpdateContact();
  const { data: categories } = useGetCategories();

  const formConfig = getContactFormConfig(categories || []);

  const onSubmit = (data: any) => {
    mutate(
      { id: contact.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le contact</DialogTitle>
          <DialogDescription>
            Modifiez les informations du contact
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={contactFormSchema}
          defaultValues={{
            nom: contact?.nom || "",
            prenom: contact?.prenom || "",
            email: contact?.email || "",
            telephone: contact?.telephone || "",
            adresse: contact?.adresse || "",
            fonction: contact?.fonction || "",
            organisation: contact?.organisation || "",
            notes: contact?.notes || "",
            categorieId: contact?.categorieId || 0,
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

export default EditContact;
