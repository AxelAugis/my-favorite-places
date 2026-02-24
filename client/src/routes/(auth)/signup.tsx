import Input from '@/components/inputs/Input.tsx'
import InputPassword from '@/components/inputs/InputPassword.tsx'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getApiUsersMeQueryKey, useGetApiUsersMe, usePostApiUsers } from '@/api'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/(auth)/signup')({
  component: SignupPage,
})

function SignupPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const authQuery = useGetApiUsersMe({
    query: {
      enabled: typeof window !== 'undefined',
      retry: 0,
    },
  })

  useEffect(() => {
    if (authQuery.isSuccess) {
      navigate({
        to: '/',
      })
    }
  }, [authQuery.isSuccess, navigate])

  const registerMutation = usePostApiUsers({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getApiUsersMeQueryKey(),
        })
        await navigate({
          to: '/',
        })
      },
      onError: (error) => {
        console.error('Registration failed:', error)
        setError(
          "Échec de l'inscription. Veuillez vérifier vos informations et réessayer.",
        )
      },
    },
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Tous les champs sont requis')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    await registerMutation.mutateAsync({
      data: {
        email: email,
        password: password,
      },
    })
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Inscription
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Input
            dataTestId='input-email'
            label="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="a@a.com"
            error={error && (error.includes('email') ? error : '')}
          />
          <InputPassword
            dataTestId='input-password'
            label="Mot de passe"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*****"
            error={error && (error.includes('mot de passe') ? error : '')}
            minLength={8}
          />
          <InputPassword
            dataTestId='input-confirm-password'
            label="Confirmer le mot de passe"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="*****"
            error={error && (error.includes('confirmer') ? error : '')}
            minLength={8}
          />
          <button
            data-testid='submit-btn'
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Vous avez déjà un compte ?{' '}
          <a
            href="/client/src/routes/(auth)/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Se connecter
          </a>
        </p>
      </div>
    </main>
  )
}
