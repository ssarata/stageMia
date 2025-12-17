import RegisterForm from "@/components/auth/RegisterForm";
import { useRegister } from "@/hooks/authUser";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const handleRegister = (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    motDePasse: string;
    password_confirmation: string;
  }) => {
    register(data, {
      onSuccess: () => {
        navigate({
          to: "/auth/login",
          replace: true,
        });
      },
    });
  };

  return <RegisterForm onSubmit={handleRegister} isLoading={isPending} />;
}