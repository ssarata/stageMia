import AddRole from '@/components/privates/role/AddRole';
import ListeRole from '@/components/privates/role/ListeRole';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router'
import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard/role/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="">
      <div className="flex items-center justify-between p-4 rounded-lg mb-4">
        <h3>Listes des roles</h3>
        <div className="">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="cursor-pointer hover:bg-blue-600 active:scale-100 hover:text-white">
            <LockKeyhole />
          </Button>
          <AddRole open={showAddDialog} onOpenChange={setShowAddDialog} />
        </div>
      </div>
      <div className="px-4">
        <ListeRole />
      </div>
    </div>
  )
}