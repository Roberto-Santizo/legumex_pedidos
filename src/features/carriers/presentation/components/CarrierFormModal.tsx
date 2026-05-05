// Created by Luis

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/features/shared/components/Modal';
import { dcsProvider } from '@/features/dc/presentation/providers/dcsRepositoryProvider';
import type { Carrier, CreateCarrierPayload } from '../../domain/domain';
import type { Dc } from '@/features/dc/dc';

interface Props {
    open: boolean;
    carrier: Carrier | null;
    saving: boolean;
    onSave: (payload: CreateCarrierPayload, id?: number) => Promise<void>;
    onClose: () => void;
}

// ── Inner form — gets remounted via key when carrier/open changes ──────────────

interface FormProps {
    carrier: Carrier | null;
    dcs: Dc[];
    saving: boolean;
    onSave: (payload: CreateCarrierPayload, id?: number) => Promise<void>;
    onClose: () => void;
}

const empty = { name: '', shippingCost: '', rateUpdatedAt: '', dcId: '' };

function CarrierForm({ carrier, dcs, saving, onSave, onClose }: FormProps) {
    const isEdit = carrier !== null;

    const [form, setForm] = useState(() =>
        carrier
            ? {
                  name: carrier.name,
                  shippingCost: String(carrier.shippingCost),
                  rateUpdatedAt: carrier.rateUpdatedAt,
                  dcId: carrier.dcId != null ? String(carrier.dcId) : '',
              }
            : empty,
    );
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const cost = parseFloat(form.shippingCost);
        const dcId = parseInt(form.dcId, 10);
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (isNaN(cost) || cost < 0) { setError('Shipping cost must be a non-negative number.'); return; }
        if (!form.rateUpdatedAt) { setError('Rate updated date is required.'); return; }
        if (isNaN(dcId)) { setError('Distribution Center is required.'); return; }

        try {
            await onSave(
                { name: form.name.trim(), shippingCost: cost, rateUpdatedAt: form.rateUpdatedAt, dcId },
                isEdit ? carrier.id : undefined,
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Distribution Center</label>
                <select
                    value={form.dcId}
                    onChange={(e) => setForm((f) => ({ ...f, dcId: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 bg-white"
                >
                    <option value="">Select a DC...</option>
                    {dcs.map((dc) => (
                        <option key={dc.id} value={dc.id}>
                            {dc.name} ({dc.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Carrier name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. FedEx Freight"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Shipping cost (USD)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.shippingCost}
                    onChange={(e) => setForm((f) => ({ ...f, shippingCost: e.target.value }))}
                    placeholder="0.00"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Rate updated date</label>
                <input
                    type="date"
                    value={form.rateUpdatedAt}
                    onChange={(e) => setForm((f) => ({ ...f, rateUpdatedAt: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 text-sm rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 text-sm rounded-lg bg-[#00C853] text-white font-semibold hover:bg-[#00b34a] transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create carrier'}
                </button>
            </div>
        </form>
    );
}

// ── Public modal wrapper ───────────────────────────────────────────────────────

export function CarrierFormModal({ open, carrier, saving, onSave, onClose }: Props) {
    const { data: dcs = [] } = useQuery({
        queryKey: ['dcs-all'],
        queryFn: () => dcsProvider.getAllDcs(),
        staleTime: 60_000,
    });

    return (
        <Modal
            modal={open}
            closeModal={onClose}
            title={carrier !== null ? 'Edit carrier' : 'New carrier'}
            width="sm:max-w-md"
        >
            <CarrierForm
                key={`${carrier?.id ?? 'new'}-${open}`}
                carrier={carrier}
                dcs={dcs}
                saving={saving}
                onSave={onSave}
                onClose={onClose}
            />
        </Modal>
    );
}
