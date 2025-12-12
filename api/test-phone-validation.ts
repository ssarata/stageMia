/**
 * Script de test pour la validation des numéros de téléphone
 * Exécuter avec: npx tsx test-phone-validation.ts
 */

import { validatePhoneNumber, WEST_AFRICAN_COUNTRIES, PHONE_EXAMPLES } from './src/utils/phoneValidator.js';

console.log('📱 Test de Validation des Numéros de Téléphone\n');
console.log('='.repeat(60));

// Test 1: Numéros valides
console.log('\n✅ Test 1: Numéros VALIDES d\'Afrique de l\'Ouest\n');

const validNumbers = [
  { number: '+22670123456', country: 'BF', description: 'Burkina Faso (format international)' },
  { number: '70123456', country: 'BF', description: 'Burkina Faso (format national)' },
  { number: '+22890123456', country: 'TG', description: 'Togo' },
  { number: '+2250712345678', country: 'CI', description: 'Côte d\'Ivoire' },
  { number: '+221771234567', country: 'SN', description: 'Sénégal' },
  { number: '+22370123456', country: 'ML', description: 'Mali' },
  { number: '+22790123456', country: 'NE', description: 'Niger' },
  { number: '+22997123456', country: 'BJ', description: 'Bénin' },
  { number: '+233241234567', country: 'GH', description: 'Ghana' },
  { number: '+2348021234567', country: 'NG', description: 'Nigeria' }
];

validNumbers.forEach(({ number, country, description }) => {
  const result = validatePhoneNumber(number, country as any);

  if (result.isValid) {
    console.log(`✓ ${description}`);
    console.log(`  Input: ${number}`);
    console.log(`  Formaté: ${result.formatted}`);
    console.log(`  Pays: ${result.country} (${result.countryCallingCode})`);
    console.log(`  Type: ${result.type}\n`);
  } else {
    console.log(`✗ ${description} - ERREUR: ${result.error}\n`);
  }
});

// Test 2: Numéros invalides
console.log('\n❌ Test 2: Numéros INVALIDES\n');

const invalidNumbers = [
  { number: '+22612345', country: 'BF', description: 'Trop court' },
  { number: '+226701234567890', country: 'BF', description: 'Trop long' },
  { number: '+1234567890', country: 'BF', description: 'Mauvais indicatif' },
  { number: 'abc123', country: 'BF', description: 'Caractères invalides' },
  { number: '', country: 'BF', description: 'Vide' }
];

invalidNumbers.forEach(({ number, country, description }) => {
  const result = validatePhoneNumber(number, country as any);

  if (!result.isValid) {
    console.log(`✓ ${description} - Rejeté correctement`);
    console.log(`  Erreur: ${result.error}\n`);
  } else {
    console.log(`✗ ${description} - DEVRAIT ÊTRE INVALIDE!\n`);
  }
});

// Test 3: Exemples de numéros par pays
console.log('\n📋 Test 3: Exemples de Numéros par Pays\n');

Object.entries(PHONE_EXAMPLES).forEach(([code, example]) => {
  const countryInfo = WEST_AFRICAN_COUNTRIES[code as keyof typeof WEST_AFRICAN_COUNTRIES];
  console.log(`${countryInfo.name} (${code}):`);
  console.log(`  Indicatif: ${countryInfo.code}`);
  console.log(`  Exemple: ${example}\n`);
});

// Test 4: Validation automatique sans pays spécifié
console.log('\n🌍 Test 4: Détection Automatique du Pays\n');

const autoDetectNumbers = [
  '+22670123456',
  '+22890123456',
  '+2250712345678',
  '+221771234567'
];

autoDetectNumbers.forEach(number => {
  const result = validatePhoneNumber(number);

  if (result.isValid) {
    const countryInfo = WEST_AFRICAN_COUNTRIES[result.country as keyof typeof WEST_AFRICAN_COUNTRIES];
    console.log(`✓ ${number}`);
    console.log(`  Détecté: ${countryInfo?.name || result.country}`);
    console.log(`  Formaté: ${result.formatted}\n`);
  }
});

// Test 5: Formats de sortie
console.log('\n📝 Test 5: Différents Formats de Sortie\n');

const testNumber = '+22670123456';
const result = validatePhoneNumber(testNumber, 'BF');

console.log(`Numéro original: ${testNumber}`);
console.log(`Format international: ${result.formatted}`);
console.log(`Numéro national: ${result.nationalNumber}`);
console.log(`Code pays: ${result.country}`);
console.log(`Indicatif: ${result.countryCallingCode}`);
console.log(`Type: ${result.type}`);

console.log('\n' + '='.repeat(60));
console.log('✅ Tests terminés!\n');
