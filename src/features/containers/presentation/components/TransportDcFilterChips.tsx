
import Select from 'react-select';
import type { OrderSummary } from '../../domain/types/types';

interface Props {
    availableOrders: OrderSummary[];
    ordersForDcOptions: OrderSummary[];
    activeFilter: { transportType: string } | null;
    onSetFilter: (filter: { transportType: string } | null) => void;
    warehouseFilter: string | null;
    onWarehouseChange: (warehouse: string | null) => void;
    poFilter: string;
    onPoChange: (po: string) => void;
    dcFilter: string[];
    onDcFilterChange: (dcs: string[]) => void;
}

/** Groups available orders by transportType and shows one chip per type. */
export function TransportDcFilterChips({
    availableOrders,
    ordersForDcOptions,
    activeFilter,
    onSetFilter,
    warehouseFilter,
    onWarehouseChange,
    poFilter,
    onPoChange,
    dcFilter,
    onDcFilterChange,
}: Props) {
    // Count orders per transportType
    const countMap = new Map<string, number>();
    for (const order of availableOrders) {
        if (!order.transportType) continue;
        countMap.set(order.transportType, (countMap.get(order.transportType) ?? 0) + 1);
    }

    const allTransportTypes = Array.from(countMap.keys()).sort();
    if (allTransportTypes.length === 0) return null;

    const warehouses = [
        ...new Set(
            availableOrders
                .map((order) => order.warehouse)
                .filter((warehouse): warehouse is string => !!warehouse),
        ),
    ].sort();

    const allDcs = [
        ...new Set(
            ordersForDcOptions
                .map((order) => order.dc)
                .filter((dc): dc is string => !!dc),
        ),
    ].sort();

    const selectClass =
        'text-xs border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors bg-white';

    return (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm px-4 py-3 space-y-2.5">
            {/* Pre-filters row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {warehouses.length > 1 && (
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest shrink-0">
                            Warehouse:
                        </label>
                        <select
                            value={warehouseFilter ?? ''}
                            onChange={(changeEvent) => onWarehouseChange(changeEvent.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">All</option>
                            {warehouses.map((warehouseName) => (
                                <option key={warehouseName} value={warehouseName}>{warehouseName}</option>
                            ))}
                        </select>
                    </div>
                )}


                {allDcs.length > 1 && (
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest shrink-0">
                            DC:
                        </label>
                        <Select
                            isMulti
                            isSearchable
                            options={allDcs.map((dc) => ({ label: dc, value: dc }))}
                            value={dcFilter.map((dc) => ({ label: dc, value: dc }))}
                            onChange={(selected) => onDcFilterChange((selected ?? []).map((opt) => opt.value))}
                            placeholder="All DCs"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '30px',
                                    fontSize: '12px',
                                    borderColor: state.isFocused ? '#14a88c' : '#e5e5e5',
                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(0,200,83,0.2)' : 'none',
                                    '&:hover': { borderColor: '#14a88c' },
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    minWidth: '180px',
                                }),
                                valueContainer: (base) => ({ ...base, padding: '1px 8px', gap: '2px' }),
                                indicatorsContainer: (base) => ({ ...base, height: '30px' }),
                                dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
                                clearIndicator: (base) => ({ ...base, padding: '4px' }),
                                option: (base, state) => ({
                                    ...base,
                                    fontSize: '12px',
                                    backgroundColor: state.isSelected ? '#14a88c' : state.isFocused ? '#ecfdf8' : 'white',
                                    color: state.isSelected ? 'white' : '#374151',
                                }),
                                multiValue: (base) => ({ ...base, backgroundColor: '#dcfce7', borderRadius: '4px' }),
                                multiValueLabel: (base) => ({ ...base, color: '#15803d', fontSize: '11px', padding: '1px 4px' }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    color: '#15803d',
                                    ':hover': { backgroundColor: '#bbf7d0', color: '#166534' },
                                }),
                                menu: (base) => ({ ...base, borderRadius: '8px', fontSize: '12px', zIndex: 50 }),
                                placeholder: (base) => ({ ...base, fontSize: '12px', color: '#94a3b8' }),
                            }}
                        />
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest shrink-0">
                        PO:
                    </label>
                    <input
                        type="text"
                        value={poFilter}
                        onChange={(changeEvent) => onPoChange(changeEvent.target.value)}
                        placeholder="Search PO..."
                        className={`${selectClass} w-32`}
                    />
                </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-widest">
                Transport Type
            </p>

            <div className="flex flex-wrap gap-2">
                {allTransportTypes.map((transportType) => {
                    const isActive = activeFilter?.transportType === transportType;
                    const count = countMap.get(transportType) ?? 0;

                    return (
                        <button
                            key={transportType}
                            type="button"
                            onClick={() =>
                                isActive
                                    ? onSetFilter(null)
                                    : onSetFilter({ transportType })
                            }
                            className={`
                                rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap border
                                ${isActive
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/30'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-500 hover:text-brand-500'
                                }
                            `}
                            aria-pressed={isActive}
                        >
                            {transportType}
                            {count > 0 && (
                                <span className={`ml-1.5 text-[10px] font-medium ${isActive ? 'text-white/75' : 'text-neutral-400'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

        </div>
    );
}
