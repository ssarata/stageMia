import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUser } from "@/hooks/private/userHook";
import { usersFormSchema } from "@/validators/allSchema";
import { useGetRoles } from "@/hooks/private/roleHook";
import { getUserFormConfig } from "@/components/Global/AllConfigField/userFormConfig";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";

interface EditUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const EditUser = ({ open, onOpenChange, user }: EditUserProps) => {
  const { mutate, isPending } = useUpdateUser();
  const { data: listesRoles } = useGetRoles();

  const formConfig = getUserFormConfig(listesRoles || []);

  const onSubmit = (data: any) => {
    mutate(
      { id: user.id, data },
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
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={usersFormSchema}
          defaultValues={{
            nom: user?.nom || "",
            prenom: user?.prenom || "",
            email: user?.email || "",
            telephone: user?.telephone || "",
            adresse: user?.adresse || "",
            motDePasse: "",
            roleId: user?.roleId || undefined,
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

export default EditUser;
