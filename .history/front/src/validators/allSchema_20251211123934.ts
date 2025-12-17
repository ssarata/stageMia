import { z } from "zod";


//================= UserForm =================//
export const userFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 caractères"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  sexe: z.enum(["M", "F", "Autre"]).optional(),
  roleId: z.coerce.number().int().positive("Veuillez sélectionner un rôle").optional(),
});
export type UserFormSchema = z.infer<typeof userFormSchema>;

// Alias pour compatibilité
export const usersFormSchema = userFormSchema;




//================= PermissionForm =================//
export const permissionFormSchema = z.object({
  nomPermission: z.string().min(3, "Le nom de la permission doit contenir au moins 3 caractères"),
  description: z.string().optional(),
});
export type PermissionFormSchema = z.infer<typeof permissionFormSchema>;

//================= RoleForm =================//
export const roleFormSchema = z.object({
  nomRole: z.string().min(3, "Le nom du rôle doit contenir au moins 3 caractères"),
  description: z.string().optional(),
});
export type RoleFormSchema = z.infer<typeof roleFormSchema>;

//================= MessageForm =================//
export const messageFormSchema = z.object({
  receiverId: z.coerce.number().int().positive("Veuillez sélectionner un destinataire"),
  contenu: z.string().min(1, "Le message ne peut pas être vide"),
  typeMessage: z.enum(["text", "contact", "file"]).optional().default("text"),
});
export type MessageFormSchema = z.infer<typeof messageFormSchema>;

//================= ContactForm =================//
export const contactFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z.string().min(8, "Le téléphone doit contenir au moins 8 caractères"),
  email: z.union([z.string().email("Email invalide"), z.literal("")]).optional(),
  adresse: z.string().optional(),
  fonction: z.string().optional(),
  organisation: z.string().optional(),
  notes: z.string().optional(),
  categorieId: z.coerce.number().int().positive("Veuillez sélectionner une catégorie").optional(),
});
export type ContactFormSchema = z.infer<typeof contactFormSchema>;

//================= CategorieForm =================//
export const categorieFormSchema = z.object({
  nomCategorie: z.string().min(2, "Le nom de la catégorie doit contenir au moins 2 caractères"),
  description: z.string().optional(),
});
export type CategorieFormSchema = z.infer<typeof categorieFormSchema>;
