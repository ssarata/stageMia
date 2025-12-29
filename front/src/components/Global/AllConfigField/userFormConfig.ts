import type { FormConfig } from "../types/formConfig";

// Configuration pour créer un nouvel utilisateur (avec mot de passe)
export const getUserFormConfig = (roles: any[] = []): FormConfig => ({
  fields: [
    {
      name: "nom",
      label: "Nom",
      type: "text",
      placeholder: "Nom de famille",
      required: true,
    },
    {
      name: "prenom",
      label: "Prénom",
      type: "text",
      placeholder: "Prénom",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@email.com",
      required: true,
    },
    {
      name: "motDePasse",
      label: "Mot de passe",
      type: "password",
      placeholder: "Minimum 6 caractères",
      required: true,
      showPasswordToggle: true,
    },
    {
      name: "adresse",
      label: "Adresse",
      type: "text",
      placeholder: "Adresse complète",
      required: true,
    },
    {
      name: "telephone",
      label: "Téléphone",
      type: "phone",
      placeholder: "Entrez votre numéro",
      required: true,
      gridCols: 1,
    },
    {
      name: "roleId",
      label: "Rôle",
      type: "select",
      placeholder: "Sélectionner un rôle",
      required: false,
      options: roles.map((role) => ({
        value: role.id,
        label: role.nomRole,
      })),
    },
  ],
});

// Configuration pour modifier un utilisateur (sans mot de passe)
export const getEditUserFormConfig = (roles: any[] = []): FormConfig => ({
  fields: [
    {
      name: "nom",
      label: "Nom",
      type: "text",
      placeholder: "Nom de famille",
      required: true,
    },
    {
      name: "prenom",
      label: "Prénom",
      type: "text",
      placeholder: "Prénom",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@email.com",
      required: true,
    },
    {
      name: "adresse",
      label: "Adresse",
      type: "text",
      placeholder: "Adresse complète",
      required: true,
    },
    {
      name: "telephone",
      label: "Téléphone",
      type: "phone",
      placeholder: "Entrez votre numéro",
      required: true,
      gridCols: 1,
    },
    {
      name: "roleId",
      label: "Rôle",
      type: "select",
      placeholder: "Sélectionner un rôle",
      required: false,
      options: roles.map((role) => ({
        value: role.id,
        label: role.nomRole,
      })),
    },
  ],
});