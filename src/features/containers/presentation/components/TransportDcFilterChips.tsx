// Created by Luis

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
    onSetFilter: (f: { transportType: string; dc: string } | null) => void;
    warehouseFilter: string | null;
    onWarehouseChange: (warehouse: string | null) => void;
}

/** Groups available orders by transportType+dc, with an optional warehouse pre-filter. */
export function TransportDcFilterChips({
    availableOrders,
    activeFilter,
    onSetFilter,
    warehouseFilter,
    onWarehouseChange,
}: Props) {

    const groupMap = new Map<string, FilterOption>();

    for (const o of availableOrders) {
        if (!o.transportType || !o.dc) continue;
        const key = `${o.transportType}__${o.dc}`;
        const existing = groupMap.get(key);
        groupMap.set(key, {
            transportType: o.transportType,
            dc: o.dc,
            warehouse: o.warehouse ?? null,
            count: (existing?.count ?? 0) + 1,
        });
    }

    const allOptions = Array.from(groupMap.values());
    if (allOptions.length === 0) return null;

    const warehouses = [
        ...new Set(allOptions.map((o) => o.warehouse).filter((w): w is string => !!w)),
    ].sort();

    const visibleOptions = warehouseFilter
        ? allOptions.filter((o) => o.warehouse === warehouseFilter)
        : allOptions;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 space-y-2.5">
            {/* Warehouse pre-filter — only shown when more than one warehouse exists */}
            {warehouses.length > 1 && (
                <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                        Warehouse:
                    </label>
                    <select
                        value={warehouseFilter ?? ''}
                        onChange={(e) => onWarehouseChange(e.target.value || null)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 focus:border-[#00C853] transition-colors bg-white"
                    >
                        <option value="">All warehouses</option>
                        {warehouses.map((w) => (
                            <option key={w} value={w}>{w}</option>
                        ))}
                    </select>
                </div>
            )}

            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                Transport · DC
            </p>

            <div className="flex flex-wrap gap-2">
                {visibleOptions.map((opt) => {
                    const isActive =
                        activeFilter?.transportType === opt.transportType &&
                        activeFilter?.dc === opt.dc;

                    return (
                        <button
                            key={`${opt.transportType}__${opt.dc}`}
                            type="button"
                            onClick={() =>
                                isActive
                                    ? onSetFilter(null)
                                    : onSetFilter({ transportType: opt.transportType, dc: opt.dc })
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
                            {opt.transportType} · {opt.dc}
                            {opt.count > 0 && (
                                <span className={`ml-1.5 text-[10px] font-medium ${isActive ? 'text-white/75' : 'text-slate-400'}`}>
                                    {opt.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
