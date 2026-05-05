// Created by Luis

import { useState } from 'react';
import { Modal } from '@/features/shared/components/Modal';
import { CapacityBar } from './CapacityBar';
import { AssignCarrierPanel } from './AssignCarrierPanel';
import { colorForOrder } from '../utils/orderColors';
import { formatShortDate } from '../utils/weekFormatter';
import { MAX_PALLETS, MAX_POUNDS } from '../utils/limits';
import type { ContainerDetail } from '../../domain/types/types';

interface Props {
    container: ContainerDetail | null;
    open: boolean;
    onClose: () => void;
    onAssignCarrier?: (carrierId: number) => Promise<void>;
}

export function ContainerDetailModal({ container, open, onClose, onAssignCarrier }: Props) {
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [assigning, setAssigning] = useState(false);

    if (!container) return null;

    const isConfirmed = container.status === 'confirmed';

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
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Included orders ({container.orders.length})
                </p>

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
                            {container.orders.map((order, idx) => (
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
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                            <tr>
                                <td colSpan={4} className="px-3 py-2.5 text-right text-slate-500 font-semibold">
                                    Total
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {container.totalPallets}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {container.totalPounds.toLocaleString()}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                    {container.orders.reduce((s, o) => s + o.totalBoxes, 0).toLocaleString()}
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
