# Guide d'utilisation du système RBAC dans le Frontend

Ce guide montre comment utiliser le système de contrôle d'accès basé sur les rôles et permissions dans vos composants React.

## 📋 Fichiers créés

1. **`/src/hooks/usePermissions.ts`** - Hook pour vérifier les permissions
2. **`/src/components/Global/ProtectedAction.tsx`** - Composant pour protéger les éléments UI

## 🎯 Utilisation du Hook `usePermissions`

### Import
```tsx
import { usePermissions } from "@/hooks/usePermissions";
```

### Vérifier les rôles
```tsx
const { isAdmin, isMIA, isLecteur, hasRole, hasAnyRole } = usePermissions();

// Vérifier si l'utilisateur est admin
if (isAdmin) {
  // Code réservé aux admins
}

// Vérifier un rôle spécifique
if (hasRole('ADMIN')) {
  // Code pour admin
}

// Vérifier plusieurs rôles
if (hasAnyRole(['ADMIN', 'MIA'])) {
  // Code pour admin OU MIA
}
```

### Vérifier les permissions
```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

// Vérifier une permission
if (hasPermission('contact.create')) {
  // L'utilisateur peut créer des contacts
}

// Vérifier au moins une permission
if (hasAnyPermission(['contact.update', 'contact.delete'])) {
  // L'utilisateur peut modifier OU supprimer
}

// Vérifier toutes les permissions
if (hasAllPermissions(['contact.read', 'contact.create'])) {
  // L'utilisateur peut lire ET créer
}
```

### Helpers CRUD
```tsx
const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

// Vérifier les permissions CRUD pour une ressource
if (canCreate('contact')) {
  // Peut créer des contacts (permission: contact.create)
}

if (canDelete('user')) {
  // Peut supprimer des utilisateurs (permission: user.delete)
}
```

## 🛡️ Utilisation du Composant `ProtectedAction`

### Import
```tsx
import { ProtectedAction, AdminOnly, AdminOrMIA } from "@/components/Global/ProtectedAction";
```

### Exemple 1: Protéger un bouton avec une permission

```tsx
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function ContactList() {
  return (
    <div>
      {/* Ce bouton n'apparaît que si l'utilisateur a la permission contact.create */}
      <ProtectedAction permission="contact.create">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contact
        </Button>
      </ProtectedAction>
    </div>
  );
}
```

### Exemple 2: Protéger plusieurs boutons d'actions

```tsx
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

function ContactActions({ contact }) {
  return (
    <div className="flex gap-2">
      {/* Bouton modifier - permission contact.update requise */}
      <ProtectedAction permission="contact.update">
        <Button variant="outline" onClick={() => handleEdit(contact)}>
          <Edit className="h-4 w-4" />
        </Button>
      </ProtectedAction>

      {/* Bouton supprimer - permission contact.delete + rôle Admin/MIA requis */}
      <ProtectedAction
        permission="contact.delete"
        anyRole={['ADMIN', 'MIA']}
      >
        <Button variant="destructive" onClick={() => handleDelete(contact.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </ProtectedAction>
    </div>
  );
}
```

### Exemple 3: Cacher complètement un élément

```tsx
import { ProtectedAction } from "@/components/Global/ProtectedAction";

function UserManagement() {
  return (
    <div>
      {/* Si l'utilisateur n'a pas la permission, rien n'est affiché */}
      <ProtectedAction permission="user.delete" hideIfNoAccess>
        <Button variant="destructive">
          Supprimer tous les utilisateurs
        </Button>
      </ProtectedAction>
    </div>
  );
}
```

### Exemple 4: Utiliser les composants helpers

```tsx
import { AdminOnly, AdminOrMIA } from "@/components/Global/ProtectedAction";

function Settings() {
  return (
    <div>
      {/* Uniquement pour les admins */}
      <AdminOnly>
        <Button>Configuration système</Button>
      </AdminOnly>

      {/* Pour admin OU personnel MIA */}
      <AdminOrMIA>
        <Button>Gestion des utilisateurs</Button>
      </AdminOrMIA>
    </div>
  );
}
```

## 📝 Exemple complet: ListeContact avec RBAC

```tsx
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ProtectedAction, AdminOrMIA } from "@/components/Global/ProtectedAction";
import { usePermissions } from "@/hooks/usePermissions";
import { Plus, Users, Edit, Trash2, Share2 } from "lucide-react";

const ListeContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { canCreate, canUpdate, canDelete } = usePermissions();

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">
              Gérez vos contacts professionnels
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton création - Uniquement si permission contact.create */}
            <ProtectedAction permission="contact.create">
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contact
              </Button>
            </ProtectedAction>
          </div>
        </div>

        {/* Tableau avec actions conditionnelles */}
        <DataTable
          data={contacts || []}
          columnDefs={colDefs}
          renderActions={(contact) => (
            <div className="flex gap-2">
              {/* Bouton modifier */}
              <ProtectedAction permission="contact.update">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(contact)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </ProtectedAction>

              {/* Bouton partager */}
              <ProtectedAction permission="SharedContact.create">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(contact)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </ProtectedAction>

              {/* Bouton supprimer - Admin ou MIA seulement */}
              <AdminOrMIA hideIfNoAccess>
                <ProtectedAction permission="contact.delete">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openConfirmModal(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ProtectedAction>
              </AdminOrMIA>
            </div>
          )}
        />

        {/* Empty state avec bouton protégé */}
        {!contacts?.length && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucun contact</h3>
            <p className="text-muted-foreground">
              Commencez par ajouter votre premier contact
            </p>
            <ProtectedAction permission="contact.create">
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un contact
              </Button>
            </ProtectedAction>
          </div>
        )}
      </div>
    </>
  );
};
```

## 🎨 Exemple: Navigation conditionnelle dans Sidebar

```tsx
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import {
  Users,
  Briefcase,
  Shield,
  Key,
  MessageSquare,
  Bell,
} from "lucide-react";

function AppSidebar() {
  const menuItems = [
    {
      title: "Contacts",
      icon: Users,
      href: "/dashboard/contact",
      permission: "contact.read",
    },
    {
      title: "Catégories",
      icon: Briefcase,
      href: "/dashboard/categorie",
      permission: "categorie.read",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/dashboard/messages",
      permission: "HistoriqueMessage.read",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
      permission: "notification.read",
    },
    {
      title: "Utilisateurs",
      icon: Shield,
      href: "/dashboard/users",
      permission: "user.read",
      anyRole: ["ADMIN", "MIA"], // En plus de la permission
    },
    {
      title: "Rôles",
      icon: Key,
      href: "/dashboard/role",
      role: "ADMIN", // Seulement admin
    },
  ];

  return (
    <nav>
      {menuItems.map((item) => (
        <ProtectedAction
          key={item.href}
          permission={item.permission}
          role={item.role}
          anyRole={item.anyRole}
          hideIfNoAccess
        >
          <a href={item.href} className="flex items-center gap-2 p-2">
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </a>
        </ProtectedAction>
      ))}
    </nav>
  );
}
```

## ⚡ Exemple: Logique conditionnelle dans du code

```tsx
import { usePermissions } from "@/hooks/usePermissions";

function ContactForm() {
  const { hasPermission, isAdmin } = usePermissions();

  const handleSubmit = async (data) => {
    // Vérifier la permission avant de faire l'action
    if (!hasPermission('contact.create')) {
      toast.error("Vous n'avez pas la permission de créer des contacts");
      return;
    }

    // Certains champs ne sont modifiables que par l'admin
    const finalData = {
      ...data,
      // Seul l'admin peut assigner une catégorie spéciale
      categorieId: isAdmin ? data.categorieId : undefined,
    };

    await createContact(finalData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulaire */}

      {/* Champ visible uniquement pour admin */}
      {isAdmin && (
        <select name="categorieId">
          <option>Catégorie spéciale</option>
        </select>
      )}
    </form>
  );
}
```

## 📊 Liste des permissions disponibles

### Contacts
- `contact.read` - Consulter les contacts
- `contact.create` - Créer des contacts
- `contact.update` - Modifier des contacts
- `contact.delete` - Supprimer des contacts
- `contact.export` - Exporter des contacts

### Catégories
- `categorie.read` - Consulter les catégories
- `categorie.create` - Créer des catégories
- `categorie.update` - Modifier des catégories
- `categorie.delete` - Supprimer des catégories

### Utilisateurs
- `user.read` - Consulter les utilisateurs
- `user.create` - Créer des utilisateurs
- `user.update` - Modifier des utilisateurs
- `user.delete` - Supprimer des utilisateurs

### Rôles
- `role.read` - Consulter les rôles
- `role.create` - Créer des rôles
- `role.update` - Modifier des rôles
- `role.delete` - Supprimer des rôles

### Permissions
- `permission.read` - Consulter les permissions
- `permission.create` - Créer des permissions
- `permission.update` - Modifier des permissions
- `permission.delete` - Supprimer des permissions

### Messages
- `HistoriqueMessage.read` - Consulter les messages
- `HistoriqueMessage.create` - Envoyer des messages
- `HistoriqueMessage.update` - Modifier des messages
- `HistoriqueMessage.delete` - Supprimer des messages

### Notifications
- `notification.read` - Consulter les notifications
- `notification.create` - Créer des notifications
- `notification.update` - Modifier des notifications
- `notification.delete` - Supprimer des notifications

### Contacts partagés
- `SharedContact.read` - Voir les contacts partagés
- `SharedContact.create` - Partager des contacts
- `SharedContact.update` - Modifier le partage
- `SharedContact.delete` - Supprimer le partage

## 🔑 Rôles disponibles

- **ADMIN** - Administrateur avec tous les droits
- **MIA** - Personnel MIA avec droits étendus
- **LECTEUR** - Utilisateur en lecture seule

## 💡 Bonnes pratiques

1. **Toujours protéger les boutons d'action sensibles**
```tsx
<ProtectedAction permission="user.delete">
  <Button variant="destructive">Supprimer</Button>
</ProtectedAction>
```

2. **Cacher les éléments inaccessibles avec `hideIfNoAccess`**
```tsx
<ProtectedAction permission="admin.config" hideIfNoAccess>
  <AdminPanel />
</ProtectedAction>
```

3. **Combiner rôles ET permissions pour double sécurité**
```tsx
<ProtectedAction anyRole={['ADMIN', 'MIA']} permission="user.delete">
  <Button>Supprimer utilisateur</Button>
</ProtectedAction>
```

4. **Utiliser les helpers pour le code plus lisible**
```tsx
const { canCreate, canDelete, isAdmin } = usePermissions();

if (canCreate('contact')) {
  // Montrer le formulaire de création
}
```

5. **Toujours valider côté backend aussi**
Les vérifications frontend sont pour l'UX, mais la vraie sécurité est côté API !
