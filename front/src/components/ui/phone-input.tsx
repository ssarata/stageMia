import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/lib/utils';

interface PhoneInputComponentProps {
  value?: string;
  onChange?: (phone: string, country: any) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  preferredCountries?: string[];
  defaultCountry?: string;
  className?: string;
}

export const PhoneInputComponent = ({
  value = '',
  onChange,
  label = 'Numéro de téléphone',
  placeholder = 'Entrez votre numéro',
  required = false,
  error = '',
  disabled = false,
  preferredCountries = ['bf', 'tg', 'ci', 'sn', 'ml', 'ne', 'gh'],
  defaultCountry = 'bf',
  className
}: PhoneInputComponentProps) => {
  const [phoneData, setPhoneData] = useState({
    countryCode: defaultCountry,
    dialCode: '',
    isValid: false
  });

  const handlePhoneChange = (phone: string, country: any) => {
    setPhoneData({
      countryCode: country.countryCode,
      dialCode: country.dialCode,
      isValid: phone.length >= (country.format?.length || 10) - 1
    });

    if (onChange) {
      onChange(`+${phone}`, country);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={handlePhoneChange}
        disabled={disabled}
        placeholder={placeholder}
        enableSearch={true}
        searchPlaceholder="Rechercher un pays..."
        preferredCountries={preferredCountries}
        containerClass="phone-input-container"
        inputClass={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        buttonClass="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        dropdownClass="bg-popover text-popover-foreground border border-input shadow-md rounded-md"
        enableAreaCodes={true}
        enableLongNumbers={true}
        countryCodeEditable={false}
        searchNotFound="Aucun pays trouvé"
        autoFormat={true}
        disableCountryCode={false}
        disableDropdown={disabled}
        masks={{bf: '.. .. .. ..', tg: '.. .. .. ..'}}
      />

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      {phoneData.isValid && !error && value && (
        <p className="text-sm text-muted-foreground">
          ✓ Numéro valide pour {phoneData.countryCode.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default PhoneInputComponent;
