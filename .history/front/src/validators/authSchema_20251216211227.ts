import { z } from "zod";
//================= Login Schema =================//

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
export type LoginSchema = z.infer<typeof loginSchema>;


//================= Register Schema =================//
export const registerSchema = z.object({
  nom: z.string().min(3, "Le nom est requis"),
  prenom: z.string().min(3, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Le téléphone est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  password_confirmation: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}).refine((data) => data.motDePasse === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

export type registerSchema = z.infer<typeof registerSchema>;