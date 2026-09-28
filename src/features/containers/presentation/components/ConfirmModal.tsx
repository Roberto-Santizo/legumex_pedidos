interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

/** Generic confirmation dialog used for destructive or risky actions. */
export function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    onConfirm,
    onCancel,
    loading = false,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-600">{message}</p>

                <div className="flex gap-3 justify-end pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-md bg-brand-700 hover:bg-brand-800 text-white font-medium transition-colors disabled:opacity-50"
                        aria-label={confirmLabel}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
