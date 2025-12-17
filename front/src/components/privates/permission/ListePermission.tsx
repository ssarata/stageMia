import { useState } from "react";
import { useGetRoles } from "@/hooks/private/roleHook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Role } from "@/interfaces/interfaceTable";

const ListePermission: React.FC = () => {
  const { data: rolesData } = useGetRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (role: Role): void => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Liste des permissions en fonction des rôles</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesData?.map((role: Role) => (
          <Card
            key={role.id}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => openModal(role)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between space-x-4">
                <div className="space-y-1">
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
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{role.users?.length || 0} utilisateur(s)</span>
                <span className="text-blue-600 font-medium">
                  {role.permissions?.length || 0} permission(s)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="space-y-2">
                <div>{selectedRole?.nomRole}</div>
                {selectedRole?.description && (
                  <p className="text-sm font-normal text-muted-foreground">
                    {selectedRole.description}
                  </p>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {selectedRole?.permissions?.length || 0} permissions
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedRole?.users?.length || 0} utilisateurs assignés
                </span>
              </div>

              {selectedRole?.permissions &&
              selectedRole.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRole.permissions.map((permission) => (
                    <Card
                      key={permission.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">
                            {permission.nomPermission}
                          </div>
                          {permission.description && (
                            <div className="text-sm text-muted-foreground">
                              {permission.description}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <div className="text-muted-foreground">
                    Aucune permission assignée à ce rôle
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={closeModal}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListePermission;
