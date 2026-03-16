import { useState } from 'react'
import { useDeleteApiAddressesId } from '@/api/hooks/useDeleteApiAddressesId'

interface AddressCardProps {
    id: number;
    name: string;
    lat: number;
    lng: number;
    description: string | null;
    onDeleted?: (id: number) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ id, name, lat, lng, description, onDeleted }) => {
    const [showModal, setShowModal] = useState(false)

    const deleteMutation = useDeleteApiAddressesId({
        mutation: {
            onSuccess: () => {
                setShowModal(false)
                onDeleted?.(id)
            },
        },
    })

    return (
        <>
            <div
                className={`group relative w-full bg-[#E0F6EB] rounded-lg shadow-lg border border-[#E0F6EB]/20 hover:border-[#C2E0D2] p-4 flex flex-col gap-y-2 transition-colors text-[#0A3633]`}
            >
                {/* Delete button, visible on hover */}
                <button
                    onClick={() => setShowModal(true)}
                    className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-800 rounded-md p-1.5`}
                    aria-label="Delete address"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </button>

                <h3 className={`font-poppins text-xl font-semibold`}>
                    {name}
                </h3>
                <p className={`text-sm text-[#0A3633]`}>{description}</p>
                <p className={`text-xs text-[#0A3633]`}>
                    Lat: {lat}, Lng: {lng}
                </p>
            </div>

            {/* Confirmation modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-y-4">
                        <h4 className="font-poppins text-lg font-semibold text-slate-100">Supprimer cette adresse ?</h4>
                        <p className="text-sm text-slate-400">
                            Vous êtes sur le point de supprimer <span className="text-slate-200 font-medium">"{name}"</span>. Cette action est irréversible.
                        </p>
                        <div className="flex gap-x-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate({ id })}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}