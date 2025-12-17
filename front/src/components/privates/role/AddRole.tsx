import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { roleFormSchema, type RoleFormSchema } from "@/validators/allSchema";
import type { OpenProps } from "@/interfaces/interfaceTable";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { ROLE } from "@/components/Global/ResetField/resetField";
import { getRoleFormConfig } from "@/components/Global/AllConfigField/roleFormConfig";
import { useAddRole } from "@/hooks/private/roleHook";

const AddRole = ({ open, onOpenChange }: OpenProps) => {
  const { mutate, isPending } = useAddRole();
  const formConfig = getRoleFormConfig();

  const onSubmit = (data: RoleFormSchema) => {
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
          <DialogTitle>Ajouter un rôle</DialogTitle>
          <DialogDescription>
            Créer un nouveau rôle
          </DialogDescription>
        </DialogHeader>
        <DynamicForm
          config={formConfig}
          schema={roleFormSchema}
          defaultValues={ROLE}
          onSubmit={onSubmit}
          isLoading={isPending}
          submitText="Ajouter le rôle"
          loadingText="Ajout en cours..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddRole;