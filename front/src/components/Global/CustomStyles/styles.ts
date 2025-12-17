// Styles pour badges (fond coloré)
export const badgeStyles = [
  "px-3 py-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md",
  "px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md",
];

// Styles de texte
export const textColors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
];

// Fonctions utilitaires
export function getRandomBadgeStyle(): string {
  return badgeStyles[Math.floor(Math.random() * badgeStyles.length)];
}

export function getRandomTextColor(): string {
  return textColors[Math.floor(Math.random() * textColors.length)];
}
