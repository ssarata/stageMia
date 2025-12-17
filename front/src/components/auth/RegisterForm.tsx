import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { registerSchema } from "@/validators/authSchema";
import { z } from "zod";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { REGISTER_FORM_DEFAULTS } from "@/components/Global/ResetField/resetField";
import { getRegisterFormConfig } from "../Global/AllConfigField/auth/authFormConfig";

// Infer the type from the Zod schema
type RegisterSchema = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterSchema) => void;
  isLoading?: boolean;
  error?: string;
}

export default function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const formConfig = getRegisterFormConfig();
  return (
    <div className="relative w-full max-w-sm">
      <Card className="relative z-10 border border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Inscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-sm mb-4">
              {error}
            </p>
          )}
          <DynamicForm
            config={formConfig}
            schema={registerSchema}
            defaultValues={REGISTER_FORM_DEFAULTS}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="S'inscrire"
            loadingText="Inscription en cours..."
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-gray-700">
          <span>Déjà un compte ?</span>
          <Link
            to="/auth/login"
            className="text-green-700 hover:text-green-800 hover:underline"
          >
            Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}