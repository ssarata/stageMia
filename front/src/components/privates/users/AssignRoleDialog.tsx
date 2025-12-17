import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRoles } from "@/hooks/private/roleHook";
import { useAssignRole } from "@/hooks/private/userHook";
import { Loader2 } from "lucide-react";

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number;
    nom: string;
    prenom: string;
    role?: {
      nomRole: string;
      id?: number;
    };
  };
}

const AssignRoleDialog = ({ open, onOpenChange, user }: AssignRoleDialogProps) => {
  const { data: roles, isLoading: rolesLoading } = useGetRoles();
  const { mutate: assignRole, isPending } = useAssignRole();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  // Reset selected role when user changes or dialog opens
  useEffect(() => {
    if (open && user.role?.id) {
      setSelectedRoleId(user.role.id.toString());
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (!selectedRoleId) return;

    assignRole(
      {
        userId: user.id,
        roleId: parseInt(selectedRoleId),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attribuer un rôle</DialogTitle>
          <DialogDescription>
            Modifier le rôle de <span className="font-semibold">{user.prenom} {user.nom}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Rôle actuel</Label>
            <div className="text-sm text-muted-foreground">
              {user.role?.nomRole || "Aucun rôle"}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-role">Nouveau rôle</Label>
            {rolesLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="new-role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role: any) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.nomRole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !selectedRoleId || selectedRoleId === user.role?.id?.toString()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Attribution...
              </>
            ) : (
              "Attribuer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoleDialog;
