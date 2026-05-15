
import { useState } from 'react';
import { Modal } from '@/features/shared/components/Modal';

interface Props {
    containerId: number;
    open: boolean;
    onClose: () => void;
    // Called with the selected date and time when the user submits the form
    onSubmit: (deliveryDate: string, deliveryTime: string) => Promise<void>;
    // Pre-fill the inputs if the container already has a delivery schedule saved
    initialDate?: string | null;
    initialTime?: string | null;
}

export function DeliveryScheduleModal({ containerId, open, onClose, onSubmit, initialDate, initialTime }: Props) {
    const [deliveryDate, setDeliveryDate] = useState(initialDate ?? '');
    const [deliveryTime, setDeliveryTime] = useState(initialTime ?? '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();
        if (!deliveryDate || !deliveryTime) return;

        setSaving(true);
        setError(null);
        try {
            await onSubmit(deliveryDate, deliveryTime);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save delivery schedule.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal modal={open} closeModal={onClose} title={`Delivery Schedule — #C-${containerId}`} width="sm:max-w-md">
            <p className="text-xs text-slate-500 mb-5">
                Set the expected delivery date and time for this container.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Delivery date */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Delivery Date
                    </label>
                    <input
                        type="date"
                        value={deliveryDate}
                        onChange={(dateInputEvent) => setDeliveryDate(dateInputEvent.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>

                {/* Delivery time */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Delivery Time
                    </label>
                    <input
                        type="time"
                        value={deliveryTime}
                        onChange={(timeInputEvent) => setDeliveryTime(timeInputEvent.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || !deliveryDate || !deliveryTime}
                        className="px-4 py-2 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Schedule'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
