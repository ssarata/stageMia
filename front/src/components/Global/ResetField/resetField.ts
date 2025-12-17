import type {
  UserFormSchema,
  RoleFormSchema,
  PermissionFormSchema,
  ContactFormSchema,
  CategorieFormSchema,
  MessageFormSchema
} from "@/validators/allSchema";

/**
 * Valeurs par défaut pour le formulaire d'ajout/édition d'utilisateur
 */
export const USER_FORM_DEFAULTS: UserFormSchema = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: "",
  motDePasse: "",
  sexe: undefined,
  roleId: undefined,
};








//==========role==================
export const ROLE: RoleFormSchema = {
  nomRole: "",
  description: "",
};

// ================= AUTH FORM DEFAULTS =================
export const LOGIN_FORM_DEFAULTS = {
  email: "",
  motDePasse: "",
};

export const REGISTER_FORM_DEFAULTS = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: "",
  motDePasse: "",
  password_confirmation: "",
};

export const FORGET_PASSWORD_DEFAULTS = {
  email: "",
};

export const VERIFY_OTP_DEFAULTS = {
  otp: "",
};

export const RESET_PASSWORD_DEFAULTS = {
  password: "",
  password_confirmation: "",
};


export const VIDEO_FORM_DEFAULTS = {
  fileVideo: undefined as unknown as FileList,
  description: "",
  niveauId: 0,
  matiereId: 0,
};


//===========SERIE===============

//==========CONTACT==========
export const CONTACT_FORM_DEFAULTS: ContactFormSchema = {
  nom: "",
  prenom: undefined,
  telephone: "",
  email: "",
  adresse: "",
  fonction: "",
  organisation: "",
  notes: "",
  categorieId: 0,
};

//==========CATEGORIE==========
export const CATEGORIE_FORM_DEFAULTS: CategorieFormSchema = {
  nomCategorie: "",
  description: "",
};

//==========ROLE==========
export const ROLE_FORM_DEFAULTS: RoleFormSchema = {
  nomRole: "",
  description: "",
};

//==========PERMISSION==========
export const PERMISSION_FORM_DEFAULTS: PermissionFormSchema = {
  nomPermission: "",
  description: "",
};

//==========MESSAGE==========
export const MESSAGE_FORM_DEFAULTS: MessageFormSchema = {
  receiverId: 0,
  contenu: "",
  typeMessage: "text",
};