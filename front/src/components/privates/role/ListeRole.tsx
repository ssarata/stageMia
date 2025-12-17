import { useState } from "react";
import { Lock } from "lucide-react";
import {
  useGetRoles,
  useAssignPermissionsToRole,
} from "@/hooks/private/roleHook";
import { useGetPermissions } from "@/hooks/private/permissionHook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Role, Permission } from "@/interfaces/interfaceTable";

const ListeRole = () => {
  const { data: rolesData } = useGetRoles();
  const { data: permissionsData } = useGetPermissions();
  const { mutate: assignPermissions, isPending } = useAssignPermissionsToRole();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(
      role.permissions?.map((p: Permission) => p.id) || []
    );
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = () => {
    if (!selectedRole) return;

    assignPermissions(
      {
        id: selectedRole.id,
        data: { permissionIds: selectedPermissions },
      },
      {
        onSuccess: handleCloseDialog,
      }
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesData?.map((role: Role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between space-x-4">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{role.nomRole}</CardTitle>
                  {role.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {role.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">
                  {role.permissions?.length || 0}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{role.users?.length || 0} utilisateur(s)</span>
                <span className="text-blue-600 font-medium">
                  {role.permissions?.length || 0} permission(s)
                </span>
              </div>

              <Dialog
                open={isDialogOpen && selectedRole?.id === role.id}
                onOpenChange={(open) => !open && handleCloseDialog()}
              >
                <DialogTrigger asChild>
                  <div className="flex justify-end mt-2 cursor-pointer">
                    <Lock className="w-4 h-4 mr-2" onClick={() => handleOpenDialog(role)}/>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Permissions pour {selectedRole?.nomRole}
                    </DialogTitle>
                    <DialogDescription>
                      Sélectionnez les permissions à assigner à ce rôle
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {permissionsData?.map((permission: Permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission(permission.id)
                            }
                          />
                          <div className="flex-1 space-y-1">
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {permission.description && (
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {selectedPermissions.length} permission(s) sélectionnée(s)
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCloseDialog}>
                        Annuler
                      </Button>
                      <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListeRole;

