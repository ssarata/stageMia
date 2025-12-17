// =================== VERIFY OTP FORM ===================
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { VERIFY_OTP_DEFAULTS } from "@/components/Global/ResetField/resetField";
import { getVerifyOtpFormConfig } from "../Global/AllConfigField/auth/authFormConfig";

const verifyOtpSchema = z.object({
  otp: z.string().min(6, "Le code doit contenir au moins 6 caractères"),
});

interface VerifyOtpFormProps {
  onSubmit: (data: { otp: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export function VerifyOtpForm({
  onSubmit,
  isLoading,
  error,
}: VerifyOtpFormProps) {
  const formConfig = getVerifyOtpFormConfig();

  return (
    <div className="relative w-full max-w-sm">
      <Card className="relative z-10 border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Vérification
          </CardTitle>
          <CardDescription className="text-center">
            Entrez le code de vérification envoyé à votre email
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
            schema={verifyOtpSchema}
            defaultValues={VERIFY_OTP_DEFAULTS}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Vérifier"
            loadingText="Vérification en cours..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
