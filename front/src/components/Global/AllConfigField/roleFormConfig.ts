import type { FormConfig } from "../types/formConfig";

export const getRoleFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "name",
      label: "Nom",
      type: "text",
      placeholder: "Nom du rôle",
      required: true,
      gridCols: 1,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description du rôle",
      required: false, 
      gridCols: 1,
    },
  ],
});