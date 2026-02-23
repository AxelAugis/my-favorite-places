import Input from '@/components/inputs/Input'
import InputPassword from '@/components/inputs/InputPassword'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Tous les champs sont requis')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    console.log('Connexion:', { email, password })
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Connexion
        </h1>

        <form  className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
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
            minLength={8}
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
          <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
            S'inscrire
          </a>
        </p>
      </div>
    </main>
  )
}
