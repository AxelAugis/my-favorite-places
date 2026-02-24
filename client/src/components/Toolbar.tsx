import { Link } from "@tanstack/react-router"
import { InputSearch } from "./inputs/search/InputSearch"
import type { Address } from "@/api"

interface ToolbarProps {
    results: Address[] | null
    onQueryChange?: (q: string) => void
}

export const Toolbar = (props: ToolbarProps) => {
    return (
        <div className={`w-full grid grid-cols-3 items-center justify-between`}>
            <div className={`w-full mx-auto flex items-center gap-x-4`}>
                {/* Fake filter btn */}
                    <button className={`py-1.5 px-8 text-sm bg-cyan-700/30 rounded-md border border-cyan-600/50 animate-pulse`}>
                        Filtrer
                    </button>
                {/* Fake sort btn */}
                    <button className={`py-1.5 px-8 text-sm bg-cyan-700/30 rounded-md border border-cyan-600/50 animate-pulse`}>
                        Trier
                    </button>
            </div>
            <InputSearch results={props.results} onQueryChange={props.onQueryChange} />
            <Link
                to="/add"
                className={`w-fit ml-auto py-1.5 px-8 text-sm bg-cyan-700/30 rounded-md border border-cyan-600/50 hover:border-cyan-500 transition-colors`}
            >
                Ajouter
            </Link>
        </div>
    )
}