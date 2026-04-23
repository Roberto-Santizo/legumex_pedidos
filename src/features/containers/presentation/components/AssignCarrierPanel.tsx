// Created by Luis

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { carriersProvider } from '@/features/carriers/carriers';

interface Props {
    currentCarrierId: number | null;
    onAssign: (carrierId: number) => Promise<void>;
    onCancel: () => void;
    assigning: boolean;
}

/**
 * Inline panel shown inside ContainerDetailModal when the user clicks
 * "Assign Transport" or "Change Transport".
 * Fetches the carrier list and lets the user pick one.
 */
export function AssignCarrierPanel({ currentCarrierId, onAssign, onCancel, assigning }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(currentCarrierId);

    const { data: carriers = [], isLoading } = useQuery({
        queryKey: ['carriers'],
        queryFn: () => carriersProvider.getAll(),
        staleTime: 60_000,
    });

    const handleAssign = async () => {
        if (selectedId === null) return;
        await onAssign(selectedId);
    };

    return (
        <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/60">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Select a carrier
            </p>

            {isLoading && (
                <p className="text-xs text-slate-400 py-2">Loading carriers...</p>
            )}

            {!isLoading && carriers.length === 0 && (
                <p className="text-xs text-slate-400 py-2">
                    No carriers available. Add one in Transportation Cost first.
                </p>
            )}

            {!isLoading && carriers.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {carriers.map((carrier) => (
                        <button
                            key={carrier.id}
                            type="button"
                            onClick={() => setSelectedId(carrier.id)}
                            className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                                selectedId === carrier.id
                                    ? 'border-[#00C853] bg-[#00C853]/8 text-slate-800'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            <span className="font-medium">{carrier.name}</span>
                            <span className="text-xs font-semibold text-slate-500">
                                ${carrier.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 text-xs rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleAssign}
                    disabled={selectedId === null || assigning}
                    className="flex-1 py-2 text-xs rounded-lg bg-[#00C853] text-white font-semibold hover:bg-[#00b34a] transition-colors disabled:opacity-50"
                >
                    {assigning ? 'Assigning...' : 'Assign'}
                </button>
            </div>
        </div>
    );
}
