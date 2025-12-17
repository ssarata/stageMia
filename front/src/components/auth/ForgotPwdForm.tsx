
// =================== FORGOT PASSWORD FORM ===================
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { FORGET_PASSWORD_DEFAULTS } from "@/components/Global/ResetField/resetField";
import { getForgetPasswordFormConfig } from "../Global/AllConfigField/auth/authFormConfig";

const forgetPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
  error,
}: ForgotPasswordFormProps) {
  const formConfig = getForgetPasswordFormConfig();

  return (
    <div className="relative w-full max-w-sm">
      <Card className="relative z-10 border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Mot de passe oublié
          </CardTitle>
          <CardDescription className="text-center">
            Entrez votre email pour réinitialiser votre mot de passe
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-sm mb-4">
              {error}
            </p>
          )}

          <DynamicForm
            config={formConfig}
            schema={forgetPasswordSchema}
            defaultValues={FORGET_PASSWORD_DEFAULTS}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Envoyer le lien"
            loadingText="Envoi en cours..."
          />

          <div className="text-center mt-4">
            <Link
              to="/auth/login"
              className="text-sm text-green-700 hover:underline hover:text-green-800"
            >
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
