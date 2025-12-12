import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Utilitaire de validation et formatage des numéros de téléphone
 * Compatible avec tous les pays du monde
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  country?: string;
  nationalNumber?: string;
  internationalNumber?: string;
  countryCallingCode?: string;
  type?: string;
  error?: string;
}

/**
 * Valider un numéro de téléphone
 * @param phoneNumber - Le numéro à valider (avec ou sans indicatif)
 * @param defaultCountry - Code pays par défaut (ex: 'BF', 'TG', 'CI')
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  defaultCountry?: CountryCode
): PhoneValidationResult => {
  try {
    // Nettoyer le numéro
    const cleanNumber = phoneNumber.trim();

    if (!cleanNumber) {
      return {
        isValid: false,
        error: 'Le numéro de téléphone est requis'
      };
    }

    // Vérifier la validité
    const isValid = isValidPhoneNumber(cleanNumber, defaultCountry);

    if (!isValid) {
      return {
        isValid: false,
        error: 'Numéro de téléphone invalide'
      };
    }

    // Parser le numéro
    const phoneNumberObj = parsePhoneNumber(cleanNumber, defaultCountry);

    if (!phoneNumberObj) {
      return {
        isValid: false,
        error: 'Impossible de parser le numéro'
      };
    }

    // Extraire les informations
    return {
      isValid: true,
      formatted: phoneNumberObj.formatInternational(),
      country: phoneNumberObj.country,
      nationalNumber: phoneNumberObj.nationalNumber,
      internationalNumber: phoneNumberObj.number,
      countryCallingCode: `+${phoneNumberObj.countryCallingCode}`,
      type: phoneNumberObj.getType() || 'UNKNOWN'
    };

  } catch (error) {
    return {
      isValid: false,
      error: 'Erreur lors de la validation du numéro'
    };
  }
};

/**
 * Formater un numéro de téléphone au format international
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  defaultCountry?: CountryCode
): string => {
  try {
    const phoneNumberObj = parsePhoneNumber(phoneNumber, defaultCountry);
    return phoneNumberObj?.formatInternational() || phoneNumber;
  } catch {
    return phoneNumber;
  }
};

/**
 * Formater un numéro au format national
 */
export const formatPhoneNumberNational = (
  phoneNumber: string,
  defaultCountry?: CountryCode
): string => {
  try {
    const phoneNumberObj = parsePhoneNumber(phoneNumber, defaultCountry);
    return phoneNumberObj?.formatNational() || phoneNumber;
  } catch {
    return phoneNumber;
  }
};

/**
 * Obtenir le code pays à partir d'un numéro
 */
export const getCountryFromPhone = (phoneNumber: string): string | undefined => {
  try {
    const phoneNumberObj = parsePhoneNumber(phoneNumber);
    return phoneNumberObj?.country;
  } catch {
    return undefined;
  }
};

/**
 * Obtenir l'indicatif téléphonique d'un pays
 */
export const getCountryCallingCode = (country: CountryCode): string => {
  try {
    const phoneNumberObj = parsePhoneNumber('+1', country); // Numéro factice
    return `+${phoneNumberObj?.countryCallingCode}` || '';
  } catch {
    return '';
  }
};

/**
 * Vérifier si deux numéros sont identiques (normalisés)
 */
export const arePhoneNumbersEqual = (
  phone1: string,
  phone2: string,
  defaultCountry?: CountryCode
): boolean => {
  try {
    const obj1 = parsePhoneNumber(phone1, defaultCountry);
    const obj2 = parsePhoneNumber(phone2, defaultCountry);

    return obj1?.number === obj2?.number;
  } catch {
    return false;
  }
};

/**
 * Liste des pays d'Afrique de l'Ouest avec leurs codes
 */
export const WEST_AFRICAN_COUNTRIES = {
  BF: { name: 'Burkina Faso', code: '+226' },
  TG: { name: 'Togo', code: '+228' },
  CI: { name: "Côte d'Ivoire", code: '+225' },
  SN: { name: 'Sénégal', code: '+221' },
  ML: { name: 'Mali', code: '+223' },
  NE: { name: 'Niger', code: '+227' },
  BJ: { name: 'Bénin', code: '+229' },
  GH: { name: 'Ghana', code: '+233' },
  NG: { name: 'Nigeria', code: '+234' },
  GN: { name: 'Guinée', code: '+224' }
} as const;

/**
 * Obtenir les informations d'un pays
 */
export const getCountryInfo = (countryCode: string) => {
  return WEST_AFRICAN_COUNTRIES[countryCode as keyof typeof WEST_AFRICAN_COUNTRIES];
};

/**
 * Valider spécifiquement pour les pays d'Afrique de l'Ouest
 */
export const validateWestAfricanPhone = (phoneNumber: string): PhoneValidationResult => {
  // Essayer de valider avec chaque pays d'Afrique de l'Ouest
  for (const [code, info] of Object.entries(WEST_AFRICAN_COUNTRIES)) {
    const result = validatePhoneNumber(phoneNumber, code as CountryCode);
    if (result.isValid) {
      return {
        ...result,
        country: code,
        formatted: result.formatted
      };
    }
  }

  return {
    isValid: false,
    error: 'Numéro non valide pour les pays d\'Afrique de l\'Ouest'
  };
};

/**
 * Exemples de numéros valides par pays
 */
export const PHONE_EXAMPLES = {
  BF: '+226 70 12 34 56',
  TG: '+228 90 12 34 56',
  CI: '+225 07 12 34 56 78',
  SN: '+221 77 123 45 67',
  ML: '+223 70 12 34 56',
  NE: '+227 90 12 34 56',
  BJ: '+229 97 12 34 56',
  GH: '+233 24 123 4567',
  NG: '+234 802 123 4567',
  GN: '+224 620 12 34 56'
} as const;
