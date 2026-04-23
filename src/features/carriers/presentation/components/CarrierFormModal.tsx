// Created by Luis

import { useEffect, useState } from 'react';
import { Modal } from '@/features/shared/components/Modal';
import type { Carrier, CreateCarrierPayload } from '../../domain/domain';

interface Props {
    open: boolean;
    carrier: Carrier | null;
    saving: boolean;
    onSave: (payload: CreateCarrierPayload, id?: number) => Promise<void>;
    onClose: () => void;
}

const empty = { name: '', shippingCost: '', rateUpdatedAt: '' };

export function CarrierFormModal({ open, carrier, saving, onSave, onClose }: Props) {
    const isEdit = carrier !== null;
    const [form, setForm] = useState(empty);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (carrier) {
            setForm({
                name: carrier.name,
                shippingCost: String(carrier.shippingCost),
                rateUpdatedAt: carrier.rateUpdatedAt,
            });
        } else {
            setForm(empty);
        }
        setError(null);
    }, [carrier, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const cost = parseFloat(form.shippingCost);
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (isNaN(cost) || cost < 0) { setError('Shipping cost must be a non-negative number.'); return; }
        if (!form.rateUpdatedAt) { setError('Rate updated date is required.'); return; }

        try {
            await onSave(
                { name: form.name.trim(), shippingCost: cost, rateUpdatedAt: form.rateUpdatedAt },
                isEdit ? carrier.id : undefined,
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    };

    return (
        <Modal
            modal={open}
            closeModal={onClose}
            title={isEdit ? 'Edit carrier' : 'New carrier'}
            width="sm:max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

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
        </Modal>
    );
}
