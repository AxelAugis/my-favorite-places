import { useState } from "react"
import { ResultsWrapper } from "./ResultsWrapper"
import { getCoordinatesFromSearch } from "@/utils/getCoordinatesfromSearch"
import type { Address } from "@/api"


interface InputSearchProps {
    results: Address[] | null
    onQueryChange?: (q: string) => void
}

export const InputSearch = (props: InputSearchProps) => {

    const [searchValue, setSearchValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredResults, setFilteredResults] = useState<Address[] | null>(null)
    const [fallbackResults, setFallbackResults] = useState<Array<{ name: string; lat: number; lng: number }> | null>(null)
    const [loadingFallback, setLoadingFallback] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        props.onQueryChange?.(value)

        if (value.length >= 2) {
            setIsOpen(true)

            if (Array.isArray(props.results)) {
                const matches = props.results.filter((r) => {
                    const q = value.toLowerCase()
                    return (
                        r.name?.toLowerCase().includes(q) ||
                        (r.description?.toLowerCase().includes(q))
                    )
                })

                if (matches.length > 0) {
                    setFilteredResults(matches)
                    setFallbackResults(null)
                    setLoadingFallback(false)
                    return
                }
            }

            setFilteredResults([])
            setLoadingFallback(true)
            setFallbackResults(null)
            getCoordinatesFromSearch(value).then((coords) => {
                setLoadingFallback(false)

                if (coords) {
                    setFallbackResults([{ name: value, lat: coords.lat, lng: coords.lng }])
                } else {
                    setFallbackResults([])
                }
            })
        } else {
            setIsOpen(false)
            setFilteredResults(null)
            setFallbackResults(null)
            setLoadingFallback(false)
        }
    }

    return (
        <div className={`relative  max-w-4xl`}>
            <div className={`py-2.5 px-4 bg-slate-700/30 rounded-lg shadow-lg border border-slate-600/50`}>
                <div className="w-full max-w-sm ">
                    <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                
                    <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-400 text-sm border border-cyan-700 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-cyan-500 hover:border-cyan-500 shadow-sm focus:shadow"
                        placeholder="Gare Part-Dieu, Lyon..." 
                        value={searchValue}
                        onChange={handleChange}
                    />
                    </div>
                </div>
            </div>
            <ResultsWrapper
                results={filteredResults  ?? props.results}
                fallback={fallbackResults}
                loadingFallback={loadingFallback}
                isOpen={
                    filteredResults !== null &&
                    filteredResults.length === 0 &&
                    (loadingFallback || fallbackResults !== null)
                }
            />
        </div>
    )
}