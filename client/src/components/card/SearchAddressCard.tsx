import type { SearchAddressResult } from '@/utils/getCoordinatesfromSearch'

interface SearchAddressCardProps {
  result: SearchAddressResult
  onAdd: (result: SearchAddressResult) => void | Promise<void>
  isPending?: boolean
  isAdded?: boolean
  disabled?: boolean
}

export function SearchAddressCard({
  result,
  onAdd,
  isPending = false,
  isAdded = false,
  disabled = false,
}: Readonly<SearchAddressCardProps>) {
  const isButtonDisabled = disabled || isPending || isAdded
  let buttonLabel = 'Ajouter'

  if (isAdded) {
    buttonLabel = 'Ajoutée'
  } else if (isPending) {
    buttonLabel = 'Ajout...'
  }

  return (
    <div className="group relative w-full bg-[#E0F6EB] rounded-lg shadow-lg border border-[#E0F6EB]/20 hover:border-[#C2E0D2] p-4 flex flex-col gap-y-2 transition-colors text-[#0A3633]">
      <button
        type="button"
        onClick={() => void onAdd(result)}
        disabled={isButtonDisabled}
        className={`absolute top-3 right-3 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          isAdded
            ? 'opacity-100 bg-[#0A3633] text-[#E0F6EB]'
            : 'opacity-0 group-hover:opacity-100 bg-[#0A3633]/10 hover:bg-[#0A3633]/20 text-[#0A3633] disabled:opacity-100 disabled:bg-slate-300 disabled:text-slate-500'
        }`}
      >
        {buttonLabel}
      </button>

      <h3 className="font-poppins text-xl font-semibold pr-24">{result.name}</h3>

      <p className="text-sm text-[#0A3633] min-h-10">
        {result.description || 'Adresse trouvée via la recherche.'}
      </p>

      <p className="text-xs text-[#0A3633]">
        Lat: {result.lat}, Lng: {result.lng}
      </p>
    </div>
  )
}