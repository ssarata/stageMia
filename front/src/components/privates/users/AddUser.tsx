import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddUser } from "@/hooks/private/userHook";
import { usersFormSchema } from "@/validators/allSchema";
import { useGetRoles } from "@/hooks/private/roleHook";
import type { OpenProps } from "@/interfaces/interfaceTable";
import { getUserFormConfig } from "@/components/Global/AllConfigField/userFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { USER_FORM_DEFAULTS } from "@/components/Global/ResetField/resetField";

const AddUser = ({ open, onOpenChange }: OpenProps) => {
  const { mutate, isPending } = useAddUser();
  const { data: listesRoles, isLoading: isLoadingRoles } = useGetRoles();

  const formConfig = getUserFormConfig(listesRoles || []);

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
          <DialogTitle>Ajouter un Utilisateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau compte utilisateur
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={usersFormSchema}
          defaultValues={USER_FORM_DEFAULTS}
          onSubmit={onSubmit}
          isLoading={isPending}
          submitText="Ajouter l'utilisateur"
          loadingText="Ajout en cours..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;