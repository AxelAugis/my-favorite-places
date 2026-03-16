import { SearchAddressCard } from '@/components/card/SearchAddressCard'
import {
  getApiAddressesQueryKey,
  useGetApiAddresses,
  useGetApiUsersMe,
  usePostApiAddresses,
} from '@/api'
import {
  searchAddresses,
  type SearchAddressResult,
} from '@/utils/getCoordinatesfromSearch'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/(address)/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<SearchAddressResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [mutationError, setMutationError] = useState('')
  const [addedNames, setAddedNames] = useState<string[]>([])

  const authQuery = useGetApiUsersMe({
    query: {
      enabled: globalThis.window !== undefined,
      retry: 0,
    },
  })

  const favoritesQuery = useGetApiAddresses({
    query: {
      enabled: authQuery.isSuccess,
      retry: 0,
    },
  })

  const addAddressMutation = usePostApiAddresses({
    mutation: {
      onSuccess: async (_response, variables) => {
        setMutationError('')
        setAddedNames((prev) =>
          prev.includes(variables.data.name)
            ? prev
            : [...prev, variables.data.name],
        )

        await queryClient.invalidateQueries({
          queryKey: getApiAddressesQueryKey(),
        })
      },
      onError: () => {
        setMutationError("Impossible d'ajouter cette adresse aux favoris.")
      },
    },
  })

  useEffect(() => {
    const trimmedValue = searchValue.trim()

    if (trimmedValue.length < 3) {
      setResults([])
      setSearchError('')
      setIsSearching(false)
      return
    }

    let isCancelled = false

    const timeout = globalThis.setTimeout(async () => {
      try {
        setIsSearching(true)
        setSearchError('')

        const nextResults = await searchAddresses(trimmedValue)

        if (!isCancelled) {
          setResults(nextResults)
        }
      } catch {
        if (!isCancelled) {
          setResults([])
          setSearchError('La recherche a échoué. Réessaie dans un instant.')
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false)
        }
      }
    }, 350)

    return () => {
      isCancelled = true
      globalThis.clearTimeout(timeout)
    }
  }, [searchValue])

  const favoriteNames = useMemo(() => {
    const names = favoritesQuery.data?.items.map((item) => item.name) ?? []
    return new Set([...names, ...addedNames])
  }, [addedNames, favoritesQuery.data?.items])

  const handleAdd = async (result: SearchAddressResult) => {
    if (!authQuery.isSuccess) {
      setMutationError('Connecte-toi pour ajouter une adresse à tes favoris.')
      return
    }

    setMutationError('')

    await addAddressMutation.mutateAsync({
      data: {
        searchWord: result.searchWord,
        name: result.name,
        description: result.description || undefined,
      },
    })
  }

  const hasTypedEnough = searchValue.trim().length >= 3

  return (
    <main className="min-h-screen flex flex-col items-center gap-y-8 text-center text-slate-100 py-4 px-16">
      <div className="w-full flex items-center justify-between">
        <Link
          to="/"
          className="py-1.5 px-8 text-sm bg-[#E0F6EB]/30 rounded-md border border-[#E0F6EB]/50 hover:border-[#E0F6EB] transition-colors"
        >
          Retour
        </Link>
          {!authQuery.isPending && !authQuery.isSuccess && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Connecte-toi pour pouvoir ajouter une adresse à tes favoris.
            </div>
          )}
      </div>

      <section className="w-full flex flex-col items-start gap-y-6 text-left">
        <div className="flex flex-col gap-y-2">
          <h1 className="font-poppins text-3xl font-bold text-[#E0F6EB]">
            Ajouter une adresse
          </h1>
          <p className="text-slate-300">
            Recherche une adresse puis ajoute-la à tes favoris.
          </p>
        </div>

        <div className="w-full rounded-lg border border-[#E0F6EB]/20 bg-[#0A3633] p-6 shadow-xl flex flex-col gap-y-4">
          <div className="w-full max-w-4xl">
            <div className="py-2.5 px-4 bg-[#0A3633]/30 rounded-lg shadow-lg border border-slate-600/50">
              <div className="w-full">
                <div className="relative flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-100 text-sm border border-[#E0F6EB]/40 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-[#E0F6EB] hover:border-[#E0F6EB]/50 shadow-sm focus:shadow"
                    placeholder="Gare Part-Dieu, Lyon..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {mutationError && (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {mutationError}
            </div>
          )}

          {searchError && (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {searchError}
            </div>
          )}

          {!hasTypedEnough && (
            <p className="text-sm text-slate-400">
              Saisis au moins 3 caractères pour lancer la recherche.
            </p>
          )}

          {isSearching && (
            <p className="text-sm text-slate-300">Recherche en cours...</p>
          )}

          {hasTypedEnough && !isSearching && results.length === 0 && !searchError && (
            <p className="text-sm text-slate-300">
              Aucune adresse ne correspond à ta recherche.
            </p>
          )}
        </div>

        {results.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => {
              const isAdded = favoriteNames.has(result.name)

              return (
                <SearchAddressCard
                  key={`${result.searchWord}-${result.lat}-${result.lng}`}
                  result={result}
                  onAdd={handleAdd}
                  isPending={
                    addAddressMutation.isPending &&
                    addAddressMutation.variables?.data.name === result.name
                  }
                  isAdded={isAdded}
                  disabled={!authQuery.isSuccess}
                />
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
