
// =================== RESET PASSWORD FORM ===================
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { RESET_PASSWORD_DEFAULTS } from "@/components/Global/ResetField/resetField";
import { getResetPasswordFormConfig } from "../Global/AllConfigField/auth/authFormConfig";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  password_confirmation: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

interface ResetPasswordFormProps {
  onSubmit: (data: { password: string; password_confirmation: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading,
  error,
}: ResetPasswordFormProps) {
  const formConfig = getResetPasswordFormConfig();

  return (
    <div className="relative w-full max-w-sm">
      <Card className="relative z-10 border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription className="text-center">
            Créez un nouveau mot de passe pour votre compte
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
            schema={resetPasswordSchema}
            defaultValues={RESET_PASSWORD_DEFAULTS}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Réinitialiser"
            loadingText="Réinitialisation en cours..."
          />
        </CardContent>
      </Card>
    </div>
  );
}