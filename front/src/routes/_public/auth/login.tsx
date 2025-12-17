import LoginForm from "@/components/auth/LoginForm";
import { useLogin } from "@/hooks/authUser";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export type LoginSearch = z.infer<typeof loginSearchSchema>;

export const Route = createFileRoute("/_public/auth/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),

  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || "/" });
    }
  },

  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (data: { email: string; motDePasse: string }) => {
    login(data, {
      onSuccess: () => {
        navigate({ to: search.redirect || "/" });
      },
    });
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isPending} />;
}
