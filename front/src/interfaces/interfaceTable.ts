
//====================User======================
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  sexe?: string;
  roleId: number;
  role?: Role;
  lastSeen?: string; // Dernière présence en ligne
  isOnline?: boolean; // Statut en ligne
  createdAt?: string;
  updatedAt?: string;
}
export interface MessageUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface Message {
  id: number;
  typeMessage: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  senderId: number;
  receiverId: number;
  sender?: MessageUser;
  receiver?: MessageUser;
}
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgetResponse{
  email: string;
}

export interface UserForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  motDePasse: string;
  sexe?: string;
  roleId?: number;
}


//=================Contact========================
export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  fonction?: string;
  organisation?: string;
  notes?: string;
  categorieId?: number;
  categorie?: Categorie;
  userId?: number;
  user?: User;
  createdAt?: string;
}

export interface ContactForm {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  fonction?: string;
  organisation?: string;
  notes?: string;
  categorieId?: number;
}

//=================Categorie========================
export interface Categorie {
  id: number;
  nomCategorie: string;
  description?: string;
  createdAt?: string;
}

export interface CategorieForm {
  nomCategorie: string;
  description?: string;
}



//=========Permission============
export interface Permission {
  id: number;
  nomPermission: string;
  description?: string;
  roles?: Role[];
  createdAt?: string;
}

export interface PermissionForm {
  nomPermission: string;
  description?: string;
}

//===========Role================
export interface Role {
  id: number;
  nomRole: string;
  description?: string;
  permissions?: Permission[];
  users?: User[];
  createdAt?: string;
}

export interface RoleForm {
  nomRole: string;
  description?: string;
}

//=========Message (HistoriqueMessage)============
// Interface already defined above with MessageUser

export interface MessageForm {
  receiverId: number;
  contenu: string;
  typeMessage?: string;
}

//=========Notification============
export interface Notification {
  id: number;
  message: string;
  date: string;
  lu: boolean;
  userId: number;
  type: string; // "info", "success", "warning", "error"
  user?: User;
}

//=========SharedContact============
export interface SharedContact {
  id: number;
  contactId: number;
  userId: number;
  recipientId: number;
  platform: string;
  sharedAt: string;
  contact?: Contact;
  user?: User;
  recipient?: User;
}

//=========Modal Props============
export interface OpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
