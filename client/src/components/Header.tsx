import { Link } from '@tanstack/react-router'
import AuthLink from './AuthLink'
import {
  getApiUsersMeQueryKey,
  useDeleteApiUsersTokens,
  useGetApiUsersMe,
} from '@/api'
import { useQueryClient } from '@tanstack/react-query'

export default function Header() {
  const queryClient = useQueryClient()
  const authLinks = [
    { variant: 'primary' as const, name: 'Connexion', url: '/login' },
    { variant: 'outline' as const, name: 'Inscription', url: '/signup' },
  ]

  const authQuery = useGetApiUsersMe({
    query: {
      enabled: typeof window !== 'undefined',
    },
  })
  const isAuthLoading = typeof window !== 'undefined' && authQuery.isPending

  const logoutMutation = useDeleteApiUsersTokens({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getApiUsersMeQueryKey(),
        })
      },
      onError: async (error) => {
        console.error('Logout error:', error)
      },
    },
  })

  return (
    <header className="w-full p-4 flex justify-between items-center bg-slate-900 text-white shadow-lg border-b border-white/10">
      <h1 className="ml-4 text-xl font-semibold">
        <Link to="/">MFP</Link>
      </h1>
      {!isAuthLoading &&
        !authQuery.isSuccess &&
        globalThis.window !== undefined && (
          <div className="flex items-center gap-x-6">
            {authLinks.map((link) => (
              <AuthLink
                key={link.name}
                variant={link.variant}
                url={link.url}
              />
            ))}
          </div>
        )}

      {!isAuthLoading && authQuery.isSuccess && authQuery.data && (
        <div className="flex items-center gap-x-4">
          <button
            data-testid="logout-btn"
            onClick={async () => await logoutMutation.mutateAsync()}
            className="px-4 py-2 bg-transparent hover:bg-red-700 rounded text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  )
}
