import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { ResetPasswordForm } from '@/components/auth/ResetPwdForm'
import { useResetPassword, useVerifyToken } from '@/hooks/authUser'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/_public/auth/resetpwd')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/_public/auth/resetpwd' })
  const { mutate: resetPassword, isPending } = useResetPassword()
  const { data: tokenData, isError } = useVerifyToken(token, !!token)

  useEffect(() => {
    if (!token) {
      toast.error('Token manquant')
      navigate({ to: '/auth/forgotpwd', replace: true })
    } else if (isError) {
      toast.error('Le lien de réinitialisation est invalide ou expiré')
      navigate({ to: '/auth/forgotpwd', replace: true })
    }
  }, [token, isError, navigate])

  const handleResetPassword = (data: { password: string; password_confirmation: string }) => {
    if (!token) {
      toast.error('Token manquant')
      return
    }

    resetPassword(
      { token, newPassword: data.password },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate({ to: '/auth/login', replace: true })
          }, 2000)
        },
      }
    )
  }

  if (!token || isError || !tokenData?.valid) {
    return null
  }

  return <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isPending} />
}
