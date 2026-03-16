import { Toolbar } from '@/components/Toolbar'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { type Address, useGetApiAddresses } from '@/api'
import { AddressCard } from '@/components/card/AddressCard'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [displayedAddresses, setDisplayedAddresses] = useState<
    Address[] | null
  >(null)

  const adressesQuery = useGetApiAddresses()

  useEffect(() => {
    if (adressesQuery.data) {
      const transformed = adressesQuery.data.items.map((item) => ({
        ...item,
        description: item.description ?? '', // Gérer les nulls
      }))
      setAddresses(transformed)
      setDisplayedAddresses(transformed)
    }
  }, [adressesQuery.data])

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
        r.description?.toLowerCase().includes(q)
      )
    })

    setDisplayedAddresses(matches)
  }

  const renderAddresses = () => {
    if (displayedAddresses === null) {
      return <p className="col-span-full text-slate-400">Loading...</p>
    }

    if (displayedAddresses.length === 0) {
      return (
        <p className="col-span-full text-slate-400">Aucune place favorite</p>
      )
    }

    const handleDelete = (id: number) => {
      setAddresses((prev) => prev?.filter((a) => a.id !== id) ?? prev)
      setDisplayedAddresses((prev) => prev?.filter((a) => a.id !== id) ?? prev)
    }

    return displayedAddresses.map((address) => (
      <AddressCard
        key={address.id}
        {...address}
        onDeleted={handleDelete}
      />
    ))
  }

  return (
    <div className="min-h-screen  flex flex-col items-center gap-y-8 text-center text-slate-100 py-4 px-16">
      <Toolbar results={addresses} onQueryChange={handleQuery} />
      <div className={`w-full flex flex-col items-start gap-y-8`}>
        <h2 className={`font-poppins text-3xl font-bold text-[#E0F6EB]`}>
          Mes places favorites
        </h2>
        <div
          className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
        >
          {renderAddresses()}
        </div>
      </div>
    </div>
  )
}
