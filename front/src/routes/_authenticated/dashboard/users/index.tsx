import AddUser from '@/components/privates/users/AddUser';
import ListeUsers from '@/components/privates/users/ListeUsers';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router'
import { UsersIcon } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="">
      <div className="flex items-center justify-between p-4 rounded-lg mb-4">
        <h3>Listes des utilisateurs</h3>
        <div className="">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="cursor-pointer hover:bg-blue-600 active:scale-100 hover:text-white">
            <UsersIcon />
          </Button>
          <AddUser open={showAddDialog} onOpenChange={setShowAddDialog} />
        </div>
      </div>
      <div className="px-4">
        <ListeUsers />
      </div>
    </div>
  )
}