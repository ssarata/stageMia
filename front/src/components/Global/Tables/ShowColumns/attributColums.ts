export const USER_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  telephone: "Téléphone",
  role: "Rôle",
  createdAt: "Date de création",
  actions: "Actions",
};

export const USER_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  role: true,
  createdAt: true,
  actions: true,
};
export type UserColumnVisibility = typeof USER_INITIAL_VISIBLE_COLUMNS;

// Specialite Table Columns
export const SPECIALITE_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom de la spécialité",
  filiere: "Filière",
  actions: "Actions",
};

export const SPECIALITE_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  filiere: true,
  actions: true,
};
export type SpecialiteColumnVisibility = typeof SPECIALITE_INITIAL_VISIBLE_COLUMNS;

// Retard Table Columns
export const RETARD_COLUMN_LABELS: Record<string, string> = {
  date: "Date",
  eleve: "Élève",
  matiere: "Matière",
  justification: "Justification",
  autorisation: "Autorisation",
  confProf: "Confirmation Prof.",
  createdAt: "Date de création",
  actions: "Actions",
};

export const RETARD_INITIAL_VISIBLE_COLUMNS = {
  date: true,
  eleve: true,
  matiere: true,
  justification: true,
  autorisation: false,
  confProf: false,
  createdAt: true,
  actions: true,
};
export type RetardColumnVisibility = typeof RETARD_INITIAL_VISIBLE_COLUMNS;

// Evaluation Table Columns
export const EVALUATION_COLUMN_LABELS: Record<string, string> = {
  date: "Date",
  type: "Type",
  matiere: "Matière",
  classe: "Classe",
  annee: "Année",
  createdAt: "Date de création",
  actions: "Actions",
};

export const EVALUATION_INITIAL_VISIBLE_COLUMNS = {
  date: true,
  type: true,
  matiere: true,
  classe: true,
  annee: true,
  createdAt: true,
  actions: true,
};
export type EvaluationColumnVisibility = typeof EVALUATION_INITIAL_VISIBLE_COLUMNS;

// Absence Table Columns
export const ABSENCE_COLUMN_LABELS: Record<string, string> = {
  date: "Date",
  motif: "Motif",
  eleve: "Élève",
  matiere: "Matière",
  staff: "Personnel",
  createdAt: "Date de création",
  actions: "Actions",
};

export const ABSENCE_INITIAL_VISIBLE_COLUMNS = {
  date: true,
  motif: true,
  eleve: true,
  matiere: true,
  staff: true,
  createdAt: true,
  actions: true,
};
export type AbsenceColumnVisibility = typeof ABSENCE_INITIAL_VISIBLE_COLUMNS;

// Annee Table Columns
export const ANNEE_COLUMN_LABELS: Record<string, string> = {
  dateDebut: "Date de début",
  dateFin: "Date de fin",
  libelle: "Libellé",
  createdAt: "Date de création",
  actions: "Actions",
};

export const ANNEE_INITIAL_VISIBLE_COLUMNS = {
  dateDebut: true,
  dateFin: true,
  libelle: true,
  createdAt: true,
  actions: true,
};
export type AnneeColumnVisibility = typeof ANNEE_INITIAL_VISIBLE_COLUMNS;

// Classe Table Columns
export const CLASSE_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  niveau: "Niveau",
  capacite: "Capacité",
  createdAt: "Date de création",
  actions: "Actions",
};

export const CLASSE_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  niveau: true,
  capacite: true,
  createdAt: true,
  actions: true,
};
export type ClasseColumnVisibility = typeof CLASSE_INITIAL_VISIBLE_COLUMNS;

// Cours Table Columns
export const COURS_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  description: "Description",
  user: "Utilisateur",
  file: "Fichier",
  createdAt: "Date de création",
  actions: "Actions",
};

export const COURS_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  description: true,
  user: true,
  file: false,
  createdAt: true,
  actions: true,
};
export type CoursColumnVisibility = typeof COURS_INITIAL_VISIBLE_COLUMNS;

// Eleve Table Columns
export const ELEVE_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  telephone: "Téléphone",
  adresse: "Adresse",
  classe: "Classe",
  filiere: "Filière",
  annee: "Année scolaire",
  actions: "Actions",
};

export const ELEVE_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  prenom: true,
  email: false,
  telephone: false,
  adresse: false,
  classe: true,
  filiere: true,
  annee: true,
  actions: true,
};

// Evenement Table Columns
export const EVENEMENT_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  dateDebut: "Date de début",
  dateFin: "Date de fin",
  staff: "Personnel",
  matiere: "Matière",
  user: "Utilisateur",
  createdAt: "Date de création",
  actions: "Actions",
};

export const EVENEMENT_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  dateDebut: true,
  dateFin: true,
  staff: true,
  matiere: true,
  user: false,
  createdAt: true,
  actions: true,
};
export type EvenementColumnVisibility = typeof EVENEMENT_INITIAL_VISIBLE_COLUMNS;

// Filiere Table Columns
export const FILIERE_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  createdAt: "Date de création",
  actions: "Actions",
};

export const FILIERE_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  createdAt: true,
  actions: true,
};
export type FiliereColumnVisibility = typeof FILIERE_INITIAL_VISIBLE_COLUMNS;

// Leave Permission Table Columns
export const LEAVE_PERMISSION_COLUMN_LABELS: Record<string, string> = {
  motif: "Motif",
  dateDebut: "Date de début",
  dateFin: "Date de fin",
  createdAt: "Date de création",
  actions: "Actions",
};

export const LEAVE_PERMISSION_INITIAL_VISIBLE_COLUMNS = {
  motif: true,
  dateDebut: true,
  dateFin: true,
  createdAt: true,
  actions: true,
};
export type LeavePermissionColumnVisibility = typeof LEAVE_PERMISSION_INITIAL_VISIBLE_COLUMNS;

// Matiere Table Columns
export const MATIERE_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  coefficient: "Coefficient",
  libelle: "Libellé",
  createdAt: "Date de création",
  actions: "Actions",
};

export const MATIERE_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  coefficient: true,
  libelle: true,
  createdAt: true,
  actions: true,
};
export type MatiereColumnVisibility = typeof MATIERE_INITIAL_VISIBLE_COLUMNS;

// Niveau Table Columns
export const NIVEAU_COLUMN_LABELS: Record<string, string> = {
  nomNiveau: "Nom du niveau",
  libelle: "Libellé",
  createdAt: "Date de création",
  actions: "Actions",
};

export const NIVEAU_INITIAL_VISIBLE_COLUMNS = {
  nomNiveau: true,
  libelle: true,
  createdAt: true,
  actions: true,
};
export type NiveauColumnVisibility = typeof NIVEAU_INITIAL_VISIBLE_COLUMNS;

// Note Table Columns
export const NOTE_COLUMN_LABELS: Record<string, string> = {
  note: "Note",
  eleve: "Élève",
  evaluation: "Évaluation",
  matiere: "Matière",
  createdAt: "Date de création",
  actions: "Actions",
};

export const NOTE_INITIAL_VISIBLE_COLUMNS = {
  note: true,
  eleve: true,
  evaluation: true,
  matiere: true,
  createdAt: true,
  actions: true,
};
export type NoteColumnVisibility = typeof NOTE_INITIAL_VISIBLE_COLUMNS;

// Parent Table Columns
export const PARENT_COLUMN_LABELS: Record<string, string> = {
  user: "Utilisateur",
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  telephone: "Téléphone",
  createdAt: "Date de création",
  actions: "Actions",
};

export const PARENT_INITIAL_VISIBLE_COLUMNS = {
  user: false,
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  createdAt: true,
  actions: true,
};
export type ParentColumnVisibility = typeof PARENT_INITIAL_VISIBLE_COLUMNS;

// Staff/Personnel Table Columns
export const STAFF_COLUMN_LABELS: Record<string, string> = {
  user: "Utilisateur",
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  telephone: "Téléphone",
  createdAt: "Date de création",
  actions: "Actions",
};

export const STAFF_INITIAL_VISIBLE_COLUMNS = {
  user: false,
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  createdAt: true,
  actions: true,
};
export type StaffColumnVisibility = typeof STAFF_INITIAL_VISIBLE_COLUMNS;

// Role Table Columns
export const ROLE_COLUMN_LABELS: Record<string, string> = {
  name: "Nom",
  description: "Description",
  createdAt: "Date de création",
  actions: "Actions",
};

export const ROLE_INITIAL_VISIBLE_COLUMNS = {
  name: true,
  description: true,
  createdAt: true,
  actions: true,
};
export type RoleColumnVisibility = typeof ROLE_INITIAL_VISIBLE_COLUMNS;

// Categorie Table Columns
export const CATEGORIE_COLUMN_LABELS: Record<string, string> = {
  nomCategorie: "Nom de la catégorie",
  description: "Description",
  contactCount: "Nombre de contacts",
  createdAt: "Date de création",
  actions: "Actions",
};

export const CATEGORIE_INITIAL_VISIBLE_COLUMNS = {
  nomCategorie: true,
  description: true,
  contactCount: true,
  createdAt: true,
  actions: true,
};
export type CategorieColumnVisibility = typeof CATEGORIE_INITIAL_VISIBLE_COLUMNS;

// Contact Table Columns
export const CONTACT_COLUMN_LABELS: Record<string, string> = {
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  telephone: "Téléphone",
  adresse: "Adresse",
  categorie: "Catégorie",
  createdAt: "Date de création",
  actions: "Actions",
};

export const CONTACT_INITIAL_VISIBLE_COLUMNS = {
  nom: true,
  prenom: true,
  email: true,
  telephone: true,
  adresse: false,
  categorie: true,
  createdAt: true,
  actions: true,
};
export type ContactColumnVisibility = typeof CONTACT_INITIAL_VISIBLE_COLUMNS;