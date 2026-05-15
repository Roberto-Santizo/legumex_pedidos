
import { useState } from 'react';
import { Modal } from '@/features/shared/components/Modal';
import { CapacityBar } from './CapacityBar';
import { AssignCarrierPanel } from './AssignCarrierPanel';
import { DeliveryScheduleModal } from './DeliveryScheduleModal';
import { colorForOrder } from '../utils/orderColors';
import { formatShortDate } from '../utils/weekFormatter';
import { MAX_PALLETS, MAX_POUNDS } from '../utils/limits';
import type { ContainerDetail } from '../../domain/types/types';

interface Props {
    container: ContainerDetail | null;
    open: boolean;
    onClose: () => void;
    onAssignCarrier?: (carrierId: number) => Promise<void>;
    onSetDeliverySchedule?: (deliveryDate: string, deliveryTime: string) => Promise<void>;
}

export function ContainerDetailModal({ container, open, onClose, onAssignCarrier, onSetDeliverySchedule }: Props) {
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<4 | 5 | null>(null);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);

    if (!container) return null;

    const isConfirmed = container.status === 'confirmed';

    // All orders in a container share the same logistics status:
    // status 4 = assigned to container, status 5 = carrier assigned
    const logisticsStatus: 4 | 5 = container.carrier !== null ? 5 : 4;

    const filteredOrders = container.orders.filter((order) => {
        if (statusFilter !== null && statusFilter !== logisticsStatus) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            String(order.id).includes(q) ||
            (order.client?.name ?? '').toLowerCase().includes(q) ||
            order.items.some((it) => (it.productName ?? '').toLowerCase().includes(q))
        );
    });

    const handleAssign = async (carrierId: number) => {
        setAssigning(true);
        try {
            await onAssignCarrier?.(carrierId);
            setShowAssignPanel(false);
        } finally {
            setAssigning(false);
        }
    };

    return (
        <Modal modal={open} closeModal={onClose} title={`Container #C-${container.id}`} width="sm:max-w-3xl">
            {/* Status + route */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-sm font-bold text-slate-800">
                        {container.transportType}{container.dc ? ` · ${container.dc}` : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Week of {container.weekStart}</p>
                </div>

                <span
                    className={`text-xs font-bold rounded-full px-3 py-1 ${
                        isConfirmed
                            ? 'bg-[#00C853] text-white'
                            : 'bg-[#00C853]/15 text-[#009940]'
                    }`}
                >
                    {isConfirmed ? '✓ CONFIRMED' : 'DRAFT'}
                </span>
            </div>

            {/* Capacity bars */}
            <div className="space-y-3 mb-5">
                <CapacityBar label="Pallets" used={container.totalPallets} max={MAX_PALLETS} />
                <CapacityBar label="Weight (lbs)" used={container.totalPounds} max={MAX_POUNDS} />
            </div>

            {/* Orders table */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Included orders ({filteredOrders.length}{filteredOrders.length !== container.orders.length ? `/${container.orders.length}` : ''})
                    </p>
                </div>

                {/* Filter bar */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* Text search */}
                    <div className="relative flex-1 min-w-44">
                        <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by client, product or #..."
                            className="w-full pl-6 pr-6 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm leading-none"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Status chips */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {(
                            [
                                { value: 4 as const, label: 'Status 4', sub: 'In Container' },
                                { value: 5 as const, label: 'Status 5', sub: 'Carrier Assigned' },
                            ]
                        ).map(({ value, label, sub }) => {
                            const isCurrent = logisticsStatus === value;
                            const isSelected = statusFilter === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setStatusFilter(isSelected ? null : value)}
                                    className={`
                                        flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-all
                                        ${isSelected
                                            ? value === 4
                                                ? 'bg-sky-500 text-white border-sky-500'
                                                : 'bg-[#00C853] text-white border-[#00C853]'
                                            : isCurrent
                                                ? value === 4
                                                    ? 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100'
                                                    : 'bg-[#00C853]/10 text-[#009940] border-[#00C853]/30 hover:bg-[#00C853]/20'
                                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-current' : 'bg-slate-300'}`} />
                                    {label}
                                    <span className="opacity-60">· {sub}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-3 py-2.5 text-left font-semibold">#</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Client</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Product(s)</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Required by</th>
                                <th className="px-3 py-2.5 text-right font-semibold">Pallets</th>
                                <th className="px-3 py-2.5 text-right font-semibold">lbs</th>
                                <th className="px-3 py-2.5 text-right font-semibold">Boxes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                                        No orders match the current filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-3 py-2 flex items-center gap-1.5">
                                            <span
                                                className="w-2 h-2 rounded-sm shrink-0"
                                                style={{ backgroundColor: colorForOrder(idx) }}
                                            />
                                            <span className="text-slate-400">{order.id}</span>
                                        </td>
                                        <td className="px-3 py-2 font-semibold text-slate-700 max-w-40 truncate">
                                            {order.client?.name ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-slate-600 max-w-48">
                                            {order.items.length === 0
                                                ? <span className="text-slate-300">—</span>
                                                : order.items.map((item, i) => (
                                                    <span key={i} className="block truncate">
                                                        {item.productName ?? '—'}
                                                    </span>
                                                ))
                                            }
                                        </td>
                                        <td className="px-3 py-2 text-sky-500 font-medium">
                                            {formatShortDate(order.requiredByDate)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-slate-600">{order.totalPallets}</td>
                                        <td className="px-3 py-2 text-right text-slate-600">{order.totalPounds.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right text-slate-600">{order.totalBoxes.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                            <tr>
                                <td colSpan={4} className="px-3 py-2.5 text-right text-slate-500 font-semibold">
                                    Total
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {filteredOrders.reduce((s, o) => s + o.totalPallets, 0)}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {filteredOrders.reduce((s, o) => s + o.totalPounds, 0).toLocaleString()}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {filteredOrders.reduce((s, o) => s + o.totalBoxes, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Assign transport section — confirmed only */}
            {isConfirmed && (
                <div className="mb-5">
                    {container.carrier ? (
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#00C853]/40 bg-[#00C853]/6">
                            <div>
                                <p className="text-xs text-[#009940] font-semibold uppercase tracking-wide mb-0.5">
                                    Assigned Transport
                                </p>
                                <p className="text-sm font-bold text-slate-800">{container.carrier.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    ${(container.carrierCostSnapshot ?? container.carrier.shippingCost).toLocaleString('en-US', { minimumFractionDigits: 2 })} / shipment
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAssignPanel((v) => !v)}
                                className="text-xs font-semibold text-[#009940] border border-[#00C853]/50 rounded-lg px-3 py-1.5 hover:bg-[#00C853]/10 transition-colors"
                            >
                                Change Transport
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowAssignPanel((v) => !v)}
                            className="w-full py-2.5 text-sm font-semibold rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#00C853] hover:text-[#009940] transition-colors"
                        >
                            + Assign Transport
                        </button>
                    )}

                    {showAssignPanel && (
                        <div className="mt-3">
                            <AssignCarrierPanel
                                dcId={container.dcId}
                                currentCarrierId={container.carrier?.id ?? null}
                                onAssign={handleAssign}
                                onCancel={() => setShowAssignPanel(false)}
                                assigning={assigning}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Delivery schedule — only shown once a carrier is assigned */}
            {isConfirmed && container.carrier && (
                <div className="mb-5">
                    {container.deliveryDate && container.deliveryTime ? (
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-sky-200 bg-sky-50">
                            <div>
                                <p className="text-xs text-sky-600 font-semibold uppercase tracking-wide mb-0.5">
                                    Delivery Schedule
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                    {container.deliveryDate} · {container.deliveryTime}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeliveryModal(true)}
                                className="text-xs font-semibold text-sky-600 border border-sky-200 rounded-lg px-3 py-1.5 hover:bg-sky-100 transition-colors"
                            >
                                Edit Schedule
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowDeliveryModal(true)}
                            className="w-full py-2.5 text-sm font-semibold rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-colors"
                        >
                            + Set Delivery Date & Time
                        </button>
                    )}
                </div>
            )}

            {/* Delivery schedule modal */}
            {showDeliveryModal && (
                <DeliveryScheduleModal
                    containerId={container.id}
                    open={showDeliveryModal}
                    onClose={() => setShowDeliveryModal(false)}
                    onSubmit={async (date, time) => { await onSetDeliverySchedule?.(date, time); }}
                    initialDate={container.deliveryDate}
                    initialTime={container.deliveryTime}
                />
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-slate-400 mb-0.5">Created by</p>
                    <p className="font-semibold text-slate-700">{container.createdBy ?? '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-slate-400 mb-0.5">Created at</p>
                    <p className="font-semibold text-slate-700">{new Date(container.createdAt).toLocaleString()}</p>
                </div>
                {isConfirmed && (
                    <>
                        <div className="bg-[#00C853]/10 rounded-lg px-3 py-2">
                            <p className="text-[#009940] mb-0.5">Confirmed by</p>
                            <p className="font-semibold text-slate-700">{container.confirmedBy ?? '—'}</p>
                        </div>
                        <div className="bg-[#00C853]/10 rounded-lg px-3 py-2">
                            <p className="text-[#009940] mb-0.5">Confirmed at</p>
                            <p className="font-semibold text-slate-700">
                                {container.confirmedAt ? new Date(container.confirmedAt).toLocaleString() : '—'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
