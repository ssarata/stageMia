// =================== LOGIN FORM ===================
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { loginSchema, type LoginSchema } from "@/validators/authSchema";
import { DynamicForm } from "@/components/Global/Forms/DynamicForm";
import { LOGIN_FORM_DEFAULTS } from "@/components/Global/ResetField/resetField";
import { getLoginFormConfig } from "../Global/AllConfigField/auth/authFormConfig";
import { UserPlus, KeyRound } from "lucide-react";

interface LoginFormProps {
  onSubmit: (data: LoginSchema) => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({
  onSubmit,
  isLoading,
  error,
}: LoginFormProps) {
  const formConfig = getLoginFormConfig();

  return (
    <div className="relative w-full max-w-sm">
      {/* Effets d'arrière-plan subtils */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full blur-xl opacity-40"></div>
      <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-amber-100 rounded-full blur-xl opacity-30"></div>

      <Card className="relative z-10 border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
        {/* Bande décorative */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1A4D7C] via-[#2D7A4A] to-[#8B6F47]"></div>

        <CardHeader className="text-center pb-1 pt-4">
          <div className="mx-auto w-10 h-10 bg-gradient-to-br from-[#1A4D7C] to-[#0F3456] rounded-full flex items-center justify-center mb-2 shadow-sm">
            <KeyRound className="w-4 h-4 text-white" />
          </div>

          <CardTitle className="text-lg font-bold bg-gradient-to-r from-[#1A4D7C] to-[#0F3456] bg-clip-text text-transparent">
            Connexion
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {error && (
            <div className="p-1.5 rounded bg-red-50 border border-red-200 flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          <DynamicForm
            config={formConfig}
            schema={loginSchema}
            defaultValues={LOGIN_FORM_DEFAULTS}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Se connecter"
            loadingText="Connexion..."
          />

          {/* Liens ultra compacts */}
          <div className="space-y-2 text-center pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Nouveau compte ?</span>
              <Link
                to="/auth/register"
                className="group flex items-center gap-1 text-[#2D7A4A] hover:text-[#1A4D7C] font-medium transition-all"
              >
                <UserPlus className="w-3 h-3" />
                <span className="hover:underline">S'inscrire</span>
              </Link>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
              <span className="text-gray-500">Mot de passe oublié ?</span>
              <Link
                to="/auth/forgotpwd"
                className="text-[#2D7A4A] hover:text-[#1A4D7C] font-medium hover:underline"
              >
                Réinitialiser
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}