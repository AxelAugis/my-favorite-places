import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { axiosInstance } from '@kubb/plugin-client/clients/axios'

let context:
  | {
      queryClient: QueryClient
    }
  | undefined

export function getContext() {
  if (context) {
    return context
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  })

  context = {
    queryClient,
  }

  return context
}

axiosInstance.defaults.withCredentials = true

export default function TanStackQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { queryClient } = getContext()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
