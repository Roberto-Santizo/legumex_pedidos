// Created by Luis

import type { OrderSummary, ContainerDetail } from '../../domain/types/types';

interface FilterOption {
    transportType: string;
    dc: string;
    count: number;
}

interface Props {
    availableOrders: OrderSummary[];
    containers: ContainerDetail[];
    activeFilter: { transportType: string; dc: string } | null;
    onSetFilter: (f: { transportType: string; dc: string } | null) => void;
}

/** Groups orders + containers by transportType+dc and renders clickable filter chips. */
export function TransportDcFilterChips({
    availableOrders,
    containers,
    activeFilter,
    onSetFilter,
}: Props) {
    const groupMap = new Map<string, FilterOption>();

    for (const o of availableOrders) {
        if (!o.transportType || !o.dc) continue;
        const key = `${o.transportType}__${o.dc}`;
        const existing = groupMap.get(key);
        groupMap.set(key, {
            transportType: o.transportType,
            dc: o.dc,
            count: (existing?.count ?? 0) + 1,
        });
    }

    for (const c of containers) {
        const key = `${c.transportType}__${c.dc}`;
        if (!groupMap.has(key)) {
            groupMap.set(key, { transportType: c.transportType, dc: c.dc, count: 0 });
        }
    }

    const options = Array.from(groupMap.values());
    if (options.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 space-y-2.5">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                Transport · DC
            </p>

            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
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
