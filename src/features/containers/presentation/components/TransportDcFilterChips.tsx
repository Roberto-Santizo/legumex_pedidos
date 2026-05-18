
import type { OrderSummary } from '../../domain/types/types';

interface FilterOption {
    transportType: string;
    dc: string;
    warehouse: string | null;
    count: number;
}

interface Props {
    availableOrders: OrderSummary[];
    activeFilter: { transportType: string; dc: string } | null;
    onSetFilter: (filter: { transportType: string; dc: string } | null) => void;
    warehouseFilter: string | null;
    onWarehouseChange: (warehouse: string | null) => void;
    transportTypeFilter: string | null;
    onTransportTypeChange: (type: string | null) => void;
    poFilter: string;
    onPoChange: (po: string) => void;
}

/** Groups available orders by transportType+dc, with optional warehouse and transport-type pre-filters. */
export function TransportDcFilterChips({
    availableOrders,
    activeFilter,
    onSetFilter,
    warehouseFilter,
    onWarehouseChange,
    transportTypeFilter,
    onTransportTypeChange,
    poFilter,
    onPoChange,
}: Props) {

    const groupMap = new Map<string, FilterOption>();

    for (const order of availableOrders) {
        if (!order.transportType || !order.dc) continue;
        const key = `${order.transportType}__${order.dc}`;
        const existing = groupMap.get(key);
        groupMap.set(key, {
            transportType: order.transportType,
            dc: order.dc,
            warehouse: order.warehouse ?? null,
            count: (existing?.count ?? 0) + 1,
        });
    }

    const allOptions = Array.from(groupMap.values());
    if (allOptions.length === 0) return null;

    const warehouses = [
        ...new Set(allOptions.map((option) => option.warehouse).filter((warehouseName): warehouseName is string => !!warehouseName)),
    ].sort();

    const transportTypes = [
        ...new Set(availableOrders.map((order) => order.transportType).filter((type): type is string => !!type)),
    ].sort();

    const visibleOptions = allOptions.filter(
        (option) =>
            (warehouseFilter === null || option.warehouse === warehouseFilter) &&
            (transportTypeFilter === null || option.transportType === transportTypeFilter),
    );

    const selectClass =
        'text-xs border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 focus:border-[#00C853] transition-colors bg-white';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 space-y-2.5">
            {/* Pre-filters row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {warehouses.length > 1 && (
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
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

                {transportTypes.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                            Type:
                        </label>
                        <select
                            value={transportTypeFilter ?? ''}
                            onChange={(changeEvent) => onTransportTypeChange(changeEvent.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">All</option>
                            {transportTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
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

            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                Transport · DC
            </p>

            <div className="flex flex-wrap gap-2">
                {visibleOptions.map((filterOption) => {
                    const isActive =
                        activeFilter?.transportType === filterOption.transportType &&
                        activeFilter?.dc === filterOption.dc;

                    return (
                        <button
                            key={`${filterOption.transportType}__${filterOption.dc}`}
                            type="button"
                            onClick={() =>
                                isActive
                                    ? onSetFilter(null)
                                    : onSetFilter({ transportType: filterOption.transportType, dc: filterOption.dc })
                            }
                            className={`
                                rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap border
                                ${isActive
                                    ? 'bg-[#00C853] text-white border-[#00C853] shadow-sm shadow-[#00C853]/30'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#00C853] hover:text-[#00C853]'
                                }
                            `}
                            aria-pressed={isActive}
                        >
                            {filterOption.transportType} · {filterOption.dc}
                            {filterOption.count > 0 && (
                                <span className={`ml-1.5 text-[10px] font-medium ${isActive ? 'text-white/75' : 'text-slate-400'}`}>
                                    {filterOption.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
