import type { FormConfig } from "../../types/formConfig";

// ================= LOGIN FORM CONFIG =================
export const getLoginFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@mail.com",
      required: true,
      gridCols: 1,
    },
    {
      name: "motDePasse",
      label: "Mot de passe",
      type: "password",
      placeholder: "******",
      required: true,
      gridCols: 1,
    },
  ],
});

// ================= REGISTER FORM CONFIG =================
export const getRegisterFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "nom",
      label: "Nom",
      type: "text",
      placeholder: "Diallo",
      required: true,
      gridCols: 1,
    },
    {
      name: "prenom",
      label: "Prénom",
      type: "text",
      placeholder: "Amadou",
      required: true,
      gridCols: 1,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@mail.com",
      required: true,
      gridCols: 1,
    },
    {
      name: "telephone",
      label: "Téléphone",
      type: "tel",
      placeholder: "+221 77 123 45 67",
      required: true,
      gridCols: 1,
    },
    {
      name: "adresse",
      label: "Adresse",
      type: "text",
      placeholder: "123 Rue de la Paix",
      required: true,
      gridCols: 1,
    },
    {
      name: "motDePasse",
      label: "Mot de passe",
      type: "password",
      placeholder: "******",
      required: true,
      gridCols: 1,
    },
    {
      name: "password_confirmation",
      label: "Confirmer le mot de passe",
      type: "password",
      placeholder: "******",
      required: true,
      gridCols: 1,
    },
  ],
});

// ================= FORGET PASSWORD FORM CONFIG =================
export const getForgetPasswordFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemple@mail.com",
      required: true,
    },
  ],
});

// ================= VERIFY OTP FORM CONFIG =================
export const getVerifyOtpFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "otp",
      label: "Code de vérification",
      type: "text",
      placeholder: "123456",
      required: true,
    },
  ],
});

// ================= RESET PASSWORD FORM CONFIG =================
export const getResetPasswordFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "password",
      label: "Nouveau mot de passe",
      type: "password",
      placeholder: "******",
      required: true,
    },
    {
      name: "password_confirmation",
      label: "Confirmer le mot de passe",
      type: "password",
      placeholder: "******",
      required: true,
    },
  ],
});

// ================= EXPORT ALL CONFIGS =================
export const authFormConfigs = {
  login: getLoginFormConfig,
  register: getRegisterFormConfig,
  forgetPassword: getForgetPasswordFormConfig,
  verifyOtp: getVerifyOtpFormConfig,
  resetPassword: getResetPasswordFormConfig,
};