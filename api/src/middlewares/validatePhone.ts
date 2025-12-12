import { Request, Response, NextFunction } from 'express';
import { validatePhoneNumber } from '../utils/phoneValidator.js';
import { CountryCode } from 'libphonenumber-js';

/**
 * Middleware pour valider les numéros de téléphone dans les requêtes
 */

interface ValidatePhoneOptions {
  field?: string; // Nom du champ à valider (défaut: 'telephone')
  required?: boolean; // Le champ est-il requis?
  defaultCountry?: CountryCode; // Pays par défaut
  autoFormat?: boolean; // Formater automatiquement le numéro?
}

export const validatePhone = (options: ValidatePhoneOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const {
      field = 'telephone',
      required = true,
      defaultCountry = 'BF',
      autoFormat = true
    } = options;

    const phoneNumber = req.body[field];

    // Vérifier si le champ est présent
    if (!phoneNumber) {
      if (required) {
        res.status(400).json({
          error: `Le champ ${field} est requis`,
          field
        });
        return;
      }
      // Si non requis et absent, continuer
      next();
      return;
    }

    // Valider le numéro
    const validation = validatePhoneNumber(phoneNumber, defaultCountry);

    if (!validation.isValid) {
      res.status(400).json({
        error: validation.error || 'Numéro de téléphone invalide',
        field,
        details: {
          provided: phoneNumber,
          country: defaultCountry
        }
      });
      return;
    }

    // Si autoFormat est activé, remplacer par le numéro formaté
    if (autoFormat && validation.formatted) {
      req.body[field] = validation.formatted;
    }

    // Ajouter les informations du téléphone à la requête
    req.body[`${field}Info`] = {
      country: validation.country,
      countryCode: validation.countryCallingCode,
      nationalNumber: validation.nationalNumber,
      type: validation.type
    };

    next();
  };
};

/**
 * Middleware spécifique pour valider les téléphones d'Afrique de l'Ouest
 */
export const validateWestAfricanPhone = (field: string = 'telephone') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const phoneNumber = req.body[field];

    if (!phoneNumber) {
      res.status(400).json({
        error: `Le champ ${field} est requis`,
        field
      });
      return;
    }

    // Pays acceptés en Afrique de l'Ouest
    const acceptedCountries: CountryCode[] = ['BF', 'TG', 'CI', 'SN', 'ML', 'NE', 'BJ', 'GH', 'NG', 'GN'];

    let isValid = false;
    let validationResult = null;

    // Essayer avec chaque pays
    for (const country of acceptedCountries) {
      const result = validatePhoneNumber(phoneNumber, country);
      if (result.isValid) {
        isValid = true;
        validationResult = result;
        break;
      }
    }

    if (!isValid) {
      res.status(400).json({
        error: 'Numéro de téléphone invalide pour les pays d\'Afrique de l\'Ouest',
        field,
        acceptedCountries: acceptedCountries.map(c => ({
          code: c,
          name: getCountryName(c)
        }))
      });
      return;
    }

    // Formater et ajouter les infos
    req.body[field] = validationResult!.formatted;
    req.body[`${field}Info`] = {
      country: validationResult!.country,
      countryCode: validationResult!.countryCallingCode,
      nationalNumber: validationResult!.nationalNumber,
      type: validationResult!.type
    };

    next();
  };
};

/**
 * Fonction utilitaire pour obtenir le nom du pays
 */
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    BF: 'Burkina Faso',
    TG: 'Togo',
    CI: 'Côte d\'Ivoire',
    SN: 'Sénégal',
    ML: 'Mali',
    NE: 'Niger',
    BJ: 'Bénin',
    GH: 'Ghana',
    NG: 'Nigeria',
    GN: 'Guinée'
  };
  return countries[code] || code;
}

/**
 * Validation pour plusieurs champs de téléphone
 */
export const validateMultiplePhones = (fields: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const phoneNumber = req.body[field];

      if (phoneNumber) {
        const validation = validatePhoneNumber(phoneNumber);

        if (!validation.isValid) {
          errors[field] = validation.error || 'Numéro invalide';
        } else {
          // Formater le numéro
          req.body[field] = validation.formatted;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: 'Validation échouée pour certains numéros',
        details: errors
      });
      return;
    }

    next();
  };
};
