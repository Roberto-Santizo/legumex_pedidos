
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { carriersProvider } from '@/features/carriers/carriers';

interface Props {
    currentCarrierId: number | null;
    onAssign: (carrierId: number) => Promise<void>;
    onCancel: () => void;
    assigning: boolean;
}

export function AssignCarrierPanel({ currentCarrierId, onAssign, onCancel, assigning }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(currentCarrierId);
    const [clientFilter, setClientFilter] = useState<string>('');
    const [dcFilter, setDcFilter] = useState<string>('');

    const { data: carriers = [], isLoading } = useQuery({
        queryKey: ['carriers', 'all'],
        queryFn: () => carriersProvider.getAll(),
        staleTime: 60_000,
    });

    const allClients = [
        ...new Set(carriers.map((carrier) => carrier.clientName).filter((clientName): clientName is string => !!clientName)),
    ].sort();

    const carriersForDcOptions = clientFilter
        ? carriers.filter((carrier) => carrier.clientName === clientFilter)
        : carriers;

    const allDcs = [
        ...new Set(carriersForDcOptions.map((carrier) => carrier.dcName).filter((dcName): dcName is string => !!dcName)),
    ].sort();

    const visibleCarriers = carriers.filter(
        (carrier) =>
            (clientFilter === '' || carrier.clientName === clientFilter) &&
            (dcFilter === '' || carrier.dcName === dcFilter),
    );

    const handleAssign = async () => {
        if (selectedId === null) return;
        await onAssign(selectedId);
    };

    const selectClass =
        'w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 focus:border-[#00C853] transition-colors bg-white';

    return (
        <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/60">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Select a carrier
            </p>

            {!isLoading && allClients.length > 1 && (
                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[15px] font-semibold text-black-400 uppercase tracking-widest">Client</span>
                        <select
                            value={clientFilter}
                            onChange={(clientSelectEvent) => {
                                setClientFilter(clientSelectEvent.target.value);
                                setDcFilter('');
                            }}
                            className={selectClass}
                        >
                            <option value="">All clients</option>
                            {allClients.map((clientName) => (
                                <option key={clientName} value={clientName}>{clientName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[15px] font-semibold text-black-400 uppercase tracking-widest">DC</span>
                        <Select
                            isSearchable
                            isClearable
                            isDisabled={allDcs.length === 0}
                            options={allDcs.map((dc) => ({ label: dc, value: dc }))}
                            value={dcFilter ? { label: dcFilter, value: dcFilter } : null}
                            onChange={(selected) => setDcFilter(selected?.value ?? '')}
                            placeholder="All DCs"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '30px',
                                    fontSize: '12px',
                                    borderColor: state.isFocused ? '#00C853' : '#e2e8f0',
                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(0,200,83,0.2)' : 'none',
                                    '&:hover': { borderColor: '#00C853' },
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                }),
                                valueContainer: (base) => ({ ...base, padding: '1px 8px' }),
                                indicatorsContainer: (base) => ({ ...base, height: '30px' }),
                                dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
                                clearIndicator: (base) => ({ ...base, padding: '4px' }),
                                option: (base, state) => ({
                                    ...base,
                                    fontSize: '12px',
                                    backgroundColor: state.isSelected ? '#00C853' : state.isFocused ? '#f0fdf4' : 'white',
                                    color: state.isSelected ? 'white' : '#374151',
                                }),
                                menu: (base) => ({ ...base, borderRadius: '8px', fontSize: '12px', zIndex: 50 }),
                                placeholder: (base) => ({ ...base, fontSize: '12px', color: '#94a3b8' }),
                            }}
                        />
                    </div>
                </div>
            )}

            {isLoading && (
                <p className="text-xs text-slate-400 py-2">Loading carriers...</p>
            )}

            {!isLoading && carriers.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No carriers available.</p>
            )}

            {!isLoading && carriers.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {visibleCarriers.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2 text-center">
                            No carriers match the selected filters.
                        </p>
                    ) : (
                        visibleCarriers.map((carrier) => (
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
                        ))
                    )}
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
