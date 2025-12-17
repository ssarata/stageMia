// forgotpwd.tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPwdForm";
import { useForgotPassword } from "@/hooks/authUser";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/auth/forgotpwd")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleForgotPassword = (data: { email: string }) => {
    forgotPassword(data, {
      onSuccess: () => {
        //Attendre 2 secondes
        setTimeout(() => {
          navigate({
            to: "/auth/login",
            replace: true,
          });
        }, 2000);
      },
    });
  };

  return <ForgotPasswordForm onSubmit={handleForgotPassword} isLoading={isPending} />;
}