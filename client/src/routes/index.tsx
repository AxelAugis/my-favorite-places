import { Toolbar } from '@/components/Toolbar'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getApiAddresses, type Address } from '@/api'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [displayedAddresses, setDisplayedAddresses] = useState<Address[] | null>(null)

  // useEffect(() => {
  //   getApiAddresses().then((response) => {
  //     const transformed = response.items.map((item) => ({
  //       ...item,
  //       description: item.description ?? '', // Gérer les nulls
  //     }))
  //     setAddresses(transformed)
  //     setDisplayedAddresses(transformed)
  //   })
  // }, [])

  const handleQuery = (value: string) => {
    if (!addresses) return
    if (value.length < 2) {
      setDisplayedAddresses(addresses)
      return
    }

    const q = value.toLowerCase()
    const matches = addresses.filter((r) => {
      return (
        r.name?.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q))
      )
    })

    setDisplayedAddresses(matches)
  }

  const renderAddresses = () => {
    if (displayedAddresses === null) {
      return <p className="col-span-full text-slate-400">Loading...</p>
    }

    if (displayedAddresses.length === 0) {
      return <p className="col-span-full text-slate-400">Aucune place favorite</p>
    }

    return displayedAddresses.map((address) => (
      <div key={address.id} className={`w-full bg-slate-700/30 rounded-lg shadow-lg border border-slate-600/50 hover:border-cyan-500 p-4 flex flex-col gap-y-2 transition-colors`}>
        <h3 className={`font-poppins text-xl font-semibold`}>{address.name}</h3>
        <p className={`text-sm text-slate-400`}>{address.description}</p>
        <p className={`text-xs text-slate-500`}>Lat: {address.lat}, Lng: {address.lng}</p>
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center gap-y-8 text-center text-slate-100 py-4 px-16">
      <Toolbar results={addresses} onQueryChange={handleQuery} />
      <div className={`w-full flex flex-col items-start gap-y-8`}>
        <h2 className={`font-poppins text-3xl font-bold`}>Mes places favorites</h2>
        <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
          {renderAddresses()}
        </div>
      </div>
    </div>
  )
}
