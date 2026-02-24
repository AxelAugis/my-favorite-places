import type { Address } from "@/api"

interface FallbackItem {
    name: string
    lat: number
    lng: number
}

interface ResultsWrapperProps {
    results: Address[] | null
    isOpen: boolean
    fallback?: FallbackItem[] | null
    loadingFallback?: boolean
}

export const ResultsWrapper = (props: ResultsWrapperProps) => {
    return (
        <div className={`absolute top-full left-0 w-full mt-1 bg-slate-900 rounded-lg shadow-lg border border-slate-600/50 p-4 animate-fade-in z-20 ${!props.isOpen && "hidden"}`}>
            {props.results === null && !props.loadingFallback && <p className="text-slate-400">Loading...</p>}

            {/* Local results */}
            {props.results !== null && props.results.length > 0 && (
                <ul className={`flex flex-col gap-y-2`}>
                    {props.results.map((result) => (
                        <li key={result.id} className={`p-2 bg-slate-700/30 rounded-md border border-slate-600/50 hover:border-cyan-500 transition-colors cursor-pointer`}>
                            {result.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* No local results, searching external */}
            {props.results !== null && props.results.length === 0 && props.loadingFallback && (
                <p className="text-slate-400">Aucun favori local correspondant — recherche externe...</p>
            )}

            {/* Fallback external results */}
            {props.fallback && props.fallback.length > 0 && (
                <ul className={`flex flex-col gap-y-2`}>
                    {props.fallback.map((item, idx) => (
                        <li key={`${item.name}-${idx}`} className={`p-2 bg-slate-700/30 rounded-md border border-slate-600/50 hover:border-cyan-500 transition-colors cursor-pointer`}>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">Lat: {item.lat}, Lng: {item.lng}</div>
                        </li>
                    ))}
                </ul>
            )}

            {/* No results at all */}
            {props.results !== null && props.results.length === 0 && !props.loadingFallback && (!props.fallback || props.fallback.length === 0) && (
                <p className="text-slate-400">Aucun résultat trouvé</p>
            )}
        </div>
    )
}