
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useNotification, Pagination } from '@/features/shared/shared';
import { carriersProvider } from '../providers/carriersRepositoryProvider';
import { CarrierFormModal, CarrierRateHistoryModal } from '../components/components';
import { ConfirmModal } from '@/features/containers/presentation/components/ConfirmModal';
import type { Carrier, CreateCarrierPayload } from '../../domain/domain';

export function TransportationCost() {
    const notify = useNotification();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page')) || 0;
    const rowsPerPage = Number(searchParams.get('limit')) || 10;

    const { data: carriers = [], isLoading, isError } = useQuery({
        queryKey: ['carriers'],
        queryFn: () => carriersProvider.getAll(),
        staleTime: 0,
    });

    // ── Search ─────────────────────────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setSearchParams((prev) => { prev.set('page', '0'); return prev; });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, setSearchParams]);

    const filteredCarriers = debouncedSearch
        ? carriers.filter((carrier) =>
              carrier.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
          )
        : carriers;

    const pagedCarriers = filteredCarriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['carriers'] });

    // ── Create / edit modal ────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Carrier | null>(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (selectedCarrier: Carrier) => { setEditing(selectedCarrier); setModalOpen(true); };
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
    const [carrierToDelete, setCarrierToDelete] = useState<Carrier | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async () => {
        if (!carrierToDelete) return;
        setDeletingId(carrierToDelete.id);
        try {
            await carriersProvider.delete(carrierToDelete.id);
            notify.success('Carrier deleted.');
            setCarrierToDelete(null);
            invalidate();
        } catch (err: unknown) {
            notify.error(err instanceof Error ? err.message : 'Failed to delete carrier.');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Rate history modal ─────────────────────────────────────────────────────
    const [historyCarrier, setHistoryCarrier] = useState<Carrier | null>(null);

    return (
        <div className="space-y-4">
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Search bar */}
                {!isLoading && !isError && (
                    <div className="px-4 py-3 border-b border-slate-100">
                        <div className="relative w-full sm:max-w-sm">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(searchEvent) => setSearchInput(searchEvent.target.value)}
                                placeholder="Search by carrier name..."
                                className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20 transition-all"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}

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
                    <>
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Carrier name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">DC</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Shipping cost</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate updated</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pagedCarriers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                            No carriers match <span className="font-semibold">"{debouncedSearch}"</span>
                                        </td>
                                    </tr>
                                ) : (
                                    pagedCarriers.map((carrier) => (
                                        <tr key={carrier.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{carrier.id}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800">{carrier.name}</td>
                                            <td className="px-4 py-3 text-slate-600 text-xs">
                                                {carrier.dcName ?? <span className="text-slate-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 text-xs">
                                                {carrier.clientName ?? <span className="text-slate-300">—</span>}
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
                                                        onClick={() => setCarrierToDelete(carrier)}
                                                        disabled={deletingId === carrier.id}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                    >
                                                        {deletingId === carrier.id ? '...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <Pagination
                count={filteredCarriers.length}
                page={page}
                rowsPerPage={rowsPerPage}
                setSearchParams={setSearchParams}
            />

            <ConfirmModal
                open={carrierToDelete !== null}
                title="Delete carrier"
                message={`Are you sure you want to delete "${carrierToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deletingId !== null}
                onConfirm={handleDelete}
                onCancel={() => setCarrierToDelete(null)}
            />

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
