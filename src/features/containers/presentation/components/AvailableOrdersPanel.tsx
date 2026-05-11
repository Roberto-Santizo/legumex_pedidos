// Created by Luis

import { useState } from 'react';
import { OrderCard } from './OrderCard';
import type { OrderSummary } from '../../domain/types/types';
import { ModalEditOrderDetails } from '@/features/my-orders/my-orders';

const PAGE_SIZE = 50;

interface Props {
    orders: OrderSummary[];
    activeFilter: { transportType: string; dc: string } | null;
    onAddOrder: (order: OrderSummary) => void;
}

/**
 * Left panel — list of orders available for assignment.
 * Filters by the active transportType+dc chip and supports client/PO search.
 * Shows PAGE_SIZE items at a time with a "Load more" button.
 */
export function AvailableOrdersPanel({ orders, activeFilter, onAddOrder }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filtered = orders.filter((o) => {
        if (activeFilter) {
            if (o.transportType !== activeFilter.transportType) return false;
            if (o.dc !== activeFilter.dc) return false;
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const clientMatch = o.client?.name.toLowerCase().includes(q) ?? false;
            const poMatch = o.items.some((i) => i.po?.toLowerCase().includes(q));
            const idMatch = String(o.id).includes(q);
            return clientMatch || poMatch || idMatch;
        }
        return true;
    });

    const visible = filtered.slice(0, visibleCount);
    const remaining = filtered.length - visible.length;

    const subtitle = activeFilter
        ? `${activeFilter.transportType} · ${activeFilter.dc} — ${filtered.length} orders`
        : `All groups — ${filtered.length} orders`;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-800">Available orders</p>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>

                <input
                    type="search"
                    placeholder="Search client, PO..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setVisibleCount(PAGE_SIZE);
                    }}
                    className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 w-40 focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 focus:border-[#00C853] transition-colors"
                    aria-label="Search orders"
                />
            </div>

            {/* Order list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-slate-400">No orders available for this week</p>
                        {activeFilter && (
                            <p className="text-xs text-slate-300 mt-1">
                                Try selecting a different transport group
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {visible.map((order) => (
                            <OrderCard key={order.id} order={order} onAdd={onAddOrder} />
                        ))}

                        {remaining > 0 && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                                className="w-full py-2 text-xs font-medium text-[#00C853] hover:text-[#00b34a] border border-dashed border-[#00C853]/40 hover:border-[#00C853] rounded-lg transition-colors"
                                aria-label={`Load ${remaining} more orders`}
                            >
                                {remaining} more — Load more
                            </button>
                        )}
                    </>
                )}
            </div>

            <ModalEditOrderDetails />
        </div>
    );
}
