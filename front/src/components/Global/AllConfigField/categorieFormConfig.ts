import type { FormConfig } from "../types/formConfig";

export const getCategorieFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "nomCategorie",
      label: "Nom de la catégorie",
      type: "text",
      placeholder: "Ex: Clients, Fournisseurs...",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Décrivez cette catégorie...",
      required: false,
      rows: 4,
    },
  ],
});
