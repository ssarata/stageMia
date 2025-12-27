import type { FormConfig } from "../types/formConfig";

export const getContactFormConfig = (categories: any[] = []): FormConfig => ({
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
      required: false,
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
      name: "categorieId",
      label: "Catégorie",
      type: "select",
      placeholder: "Sélectionner une catégorie",
      required: true,
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.nomCategorie,
      })),
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@email.com",
      required: false,
    },
    {
      name: "adresse",
      label: "Adresse",
      type: "text",
      placeholder: "Adresse complète",
      required: false,
    },
    {
      name: "fonction",
      label: "Fonction",
      type: "text",
      placeholder: "Poste ou fonction",
      required: false,
    },
    {
      name: "organisation",
      label: "Organisation",
      type: "text",
      placeholder: "Entreprise ou organisation",
      required: false,
    },
  ],
});
