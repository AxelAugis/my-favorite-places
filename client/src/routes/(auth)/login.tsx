import Input from '@/components/inputs/Input.tsx'
import InputPassword from '@/components/inputs/InputPassword.tsx'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getApiUsersMeQueryKey, useGetApiUsersMe, usePostApiUsersTokens } from '@/api'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/(auth)/login')({ component: LoginPage })

function LoginPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const authQuery = useGetApiUsersMe({
    query: {
      enabled: typeof window !== 'undefined',
      retry: 0,
    },
  })

  useEffect(() => {
    if (authQuery.isSuccess) {
      navigate({ to: '/' })
    }
  }, [authQuery.isSuccess, navigate])

  const loginMutation = usePostApiUsersTokens({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getApiUsersMeQueryKey(),
        })
        await navigate({ to: '/' })
      },
      onError: (error) => {
        console.error('Login failed:', error)
        setError(
          'Échec de la connexion. Veuillez vérifier vos informations et réessayer.',
        )
      },
    },
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      console.log({
        email,
        password,
      })
      setError('Tous les champs sont requis')
      return
    }

    await loginMutation.mutateAsync({
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
          Connexion
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-white px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
          />

          <InputPassword
            label="Mot de passe"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={3}
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Vous n'avez pas de compte ?{' '}
          <a
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </main>
  )
}
