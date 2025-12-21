//---------------------all---------------
export type FieldType =
  // Textes
  | "text"
  | "email"
  | "password"
  | "tel"
  | "phone"
  | "url"
  | "search"
  | "textarea" 
  
  // Nombres
  | "number" 
  | "range"
  
  // Dates et temps
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  
  // Sélections
  | "select" 
  | "multiselect"
  | "radio"
  | "checkbox"
  | "switch"
  
  // Fichiers
  | "file"
  | "image"
  
  // Couleurs
  | "color"
  
  // Autres
  | "hidden";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  
  // Pour select, multiselect, radio, checkbox
  options?: SelectOption[];
  isLoading?: boolean;
  
  // Pour password
  showPasswordToggle?: boolean;
  
  // Pour number et range
  min?: number;
  max?: number;
  step?: number;
  
  // Pour textarea
  rows?: number;
  cols?: number;
  
  // Pour file et image
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // en MB
  
  // Pour text et textarea
  maxLength?: number;
  minLength?: number;
  
  // Pour tous les champs
  helperText?: string;
  
  // Pour checkbox et switch
  defaultChecked?: boolean;
  
  // Classes CSS personnalisées
  className?: string;
  
  // Validation personnalisée
  pattern?: string;
  
  // Pour les champs conditionnels
  dependsOn?: string;
  showWhen?: (value: any) => boolean;
  
  // Pour le layout en grille ← AJOUTE CETTE LIGNE
  gridCols?: 1 | 2;
}

export interface FormConfig {
  fields: FieldConfig[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number; // Pour layout grid
}