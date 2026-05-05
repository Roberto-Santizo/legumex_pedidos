// Created by Luis

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/features/shared/shared';
import { carriersProvider } from '../providers/carriersRepositoryProvider';
import { CarrierFormModal, CarrierRateHistoryModal } from '../components/components';
import type { Carrier, CreateCarrierPayload } from '../../domain/domain';

export function TransportationCost() {
    const notify = useNotification();
    const queryClient = useQueryClient();

    const { data: carriers = [], isLoading, isError } = useQuery({
        queryKey: ['carriers'],
        queryFn: () => carriersProvider.getAll(),
        staleTime: 0,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['carriers'] });

    // ── Form modal ─────────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Carrier | null>(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (c: Carrier) => { setEditing(c); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditing(null); };

    const handleSave = async (payload: CreateCarrierPayload, id?: number) => {
        setSaving(true);
        try {
            if (id !== undefined) {
                await carriersProvider.update(id, payload);
                notify.success('Carrier updated successfully.');
                queryClient.invalidateQueries({ queryKey: ['carrier-rates', id] });
            } else {
                await carriersProvider.create(payload);
                notify.success('Carrier created successfully.');
            }
            closeModal();
            invalidate();
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this carrier? This action cannot be undone.')) return;
        setDeletingId(id);
        try {
            await carriersProvider.delete(id);
            notify.success('Carrier deleted.');
            invalidate();
        } catch (err: unknown) {
            notify.error(err instanceof Error ? err.message : 'Failed to delete carrier.');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Rate history modal ─────────────────────────────────────────────────────
    const [historyCarrier, setHistoryCarrier] = useState<Carrier | null>(null);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Transportation Cost</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Manage carriers and their shipping rates</p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00C853] text-white hover:bg-[#00b34a] transition-colors shadow-sm"
                >
                    + New carrier
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-sm text-slate-400">Loading...</p>
                    </div>
                )}

                {isError && (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-sm text-red-500">Failed to load carriers. Please try again.</p>
                    </div>
                )}

                {!isLoading && !isError && carriers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <p className="text-sm font-semibold text-slate-500">No carriers yet</p>
                        <p className="text-xs text-slate-400">Click "New carrier" to add your first one.</p>
                    </div>
                )}

                {!isLoading && !isError && carriers.length > 0 && (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Carrier name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">DC</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Shipping cost</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate updated</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {carriers.map((carrier) => (
                                <tr key={carrier.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{carrier.id}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">{carrier.name}</td>
                                    <td className="px-4 py-3 text-slate-600 text-xs">
                                        {carrier.dcName ?? <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setHistoryCarrier(carrier)}
                                            className="group inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#00C853] transition-colors"
                                            title="View rate history"
                                        >
                                            <span>
                                                ${carrier.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity"
                                            >
                                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm.75-10.25a.75.75 0 0 0-1.5 0v3.69L5.47 6.97a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06L8.75 8.44V4.75z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{carrier.rateUpdatedAt}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(carrier)}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(carrier.id)}
                                                disabled={deletingId === carrier.id}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === carrier.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <CarrierFormModal
                open={modalOpen}
                carrier={editing}
                saving={saving}
                onSave={handleSave}
                onClose={closeModal}
            />

            <CarrierRateHistoryModal
                open={historyCarrier !== null}
                carrier={historyCarrier}
                onClose={() => setHistoryCarrier(null)}
            />
        </div>
    );
}
