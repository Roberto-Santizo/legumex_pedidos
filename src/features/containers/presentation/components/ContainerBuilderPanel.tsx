
import { useState } from 'react';
import { CapacityBar } from './CapacityBar';
import { ContainerVisualization } from './ContainerVisualization';
import { ConfirmModal } from './ConfirmModal';
import { colorForOrder } from '../utils/orderColors';
import { formatShortDate } from '../utils/weekFormatter';
import { MAX_PALLETS, MAX_POUNDS, HARD_MAX_POUNDS, MIN_POUNDS_RECOMMENDED } from '../utils/limits';
import type { DraftContainer } from '../../domain/types/types';

interface Props {
    draft: DraftContainer | null;
    activeFilter: { transportType: string; dc: string } | null;
    onStartNewDraft: () => void;
    onRemoveOrder: (orderId: number) => void;
    onDiscard: () => void;
    onSave: () => Promise<void>;
    onConfirm: () => Promise<void>;
}

/**
 * Right panel — shows the draft container being built.
 * Empty state: prompt to start a new draft.
 * Active draft: capacity bars, visual grid, order list, action buttons.
 */
export function ContainerBuilderPanel({
    draft,
    activeFilter,
    onStartNewDraft,
    onRemoveOrder,
    onDiscard,
    onSave,
    onConfirm,
}: Props) {
    const [saving, setSaving] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const [showLowWeightConfirm, setShowLowWeightConfirm] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try { await onSave(); } finally { setSaving(false); }
    };

    const handleConfirmClick = () => {
        if (draft && draft.totalPounds < MIN_POUNDS_RECOMMENDED) {
            setShowLowWeightConfirm(true);
        } else {
            void doConfirm();
        }
    };

    const doConfirm = async () => {
        setShowLowWeightConfirm(false);
        setConfirming(true);
        try { await onConfirm(); } finally { setConfirming(false); }
    };

    // ── Empty state ────────────────────────────────────────────────────────────
    if (!draft) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-64 p-8 text-center gap-5">
                {/* Icon placeholder */}
                <div className="w-14 h-14 rounded-2xl bg-[#00C853]/10 flex items-center justify-center text-2xl">
                    📦
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">No container open</p>
                    <p className="text-xs text-slate-400">
                        Select a transport group and click "New container"
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onStartNewDraft}
                    disabled={!activeFilter}
                    className="px-5 py-2 text-sm font-semibold rounded-lg border-2 border-dashed border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Start a new draft container"
                >
                    + New container
                </button>

                {!activeFilter && (
                    <p className="text-[11px] text-slate-300">
                        Select a transport group filter first
                    </p>
                )}
            </div>
        );
    }

    // ── Active draft ───────────────────────────────────────────────────────────
    const isAtHardLimit    = draft.totalPounds  >= HARD_MAX_POUNDS;
    const isBelowMinWeight = draft.totalPounds < MIN_POUNDS_RECOMMENDED;

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-0">
                {/* Header — green accent gradient */}
                <div className="px-4 py-3 bg-linear-to-r from-[#00C853]/10 to-[#00C853]/5 border-b border-[#00C853]/20 flex items-center justify-between rounded-t-xl">
                    <div>
                        <p className="text-sm font-bold text-slate-800">
                            {draft.persistedId ? `Container #C-${draft.persistedId}` : 'New container'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {draft.transportType} · {draft.dc}
                        </p>
                    </div>
                    <span className="text-[11px] bg-[#00C853] text-white font-bold rounded-full px-2.5 py-0.5 tracking-wide">
                        DRAFT
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Capacity bars */}
                    <CapacityBar label="Pallets" used={draft.totalPallets} max={MAX_PALLETS} />
                    <CapacityBar
                        label="Weight (lbs)"
                        used={draft.totalPounds}
                        max={MAX_POUNDS}
                        note={isBelowMinWeight ? `Recommended min: ${MIN_POUNDS_RECOMMENDED.toLocaleString()} lbs` : null}
                    />

                    {/* Visual grid */}
                    {draft.orders.length > 0 && (
                        <ContainerVisualization
                            orders={draft.orders}
                            totalPallets={draft.totalPallets}
                        />
                    )}

                    {/* Orders list */}
                    {draft.orders.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Included orders ({draft.orders.length})
                            </p>
                            {draft.orders.map((order, idx) => (
                                <div
                                    key={order.id}
                                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                                        style={{ backgroundColor: colorForOrder(idx) }}
                                    />
                                    <span className="text-xs text-slate-400">#{order.id}</span>
                                    <span className="text-xs font-semibold text-slate-700 truncate flex-1">
                                        {order.client?.name ?? '—'}
                                    </span>
                                    <span className="text-[11px] text-sky-500 font-medium">
                                        {formatShortDate(order.requiredByDate)}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        {order.totalPallets}p · {order.totalPounds.toLocaleString()}lb
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveOrder(order.id)}
                                        className="text-slate-300 hover:text-red-400 transition-colors ml-1 shrink-0 text-xs"
                                        aria-label={`Remove order #${order.id}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {draft.orders.length === 0 && (
                        <p className="text-xs text-slate-300 text-center py-6">
                            No orders added yet — use the left panel to add orders
                        </p>
                    )}

                    {/* Hard limit warning — only blocks at 42,000 lbs */}
                    {isAtHardLimit && (
                        <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
                            ⚠ Container has reached the maximum weight of {HARD_MAX_POUNDS.toLocaleString()} lbs — no more orders can be added.
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowDiscardConfirm(true)}
                        className="flex-1 py-2 text-sm rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                        aria-label="Discard draft container"
                    >
                        Discard
                    </button>

                    {!draft.persistedId && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || draft.orders.length === 0}
                            className="flex-1 py-2 text-sm rounded-lg border-2 border-[#00C853] text-[#00C853] font-semibold hover:bg-[#00C853] hover:text-white transition-all disabled:opacity-40"
                            aria-label="Save as draft"
                        >
                            {saving ? 'Saving...' : 'Save draft'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleConfirmClick}
                        disabled={confirming || draft.orders.length === 0}
                        className="flex-1 py-2 text-sm rounded-lg bg-[#00C853] text-white font-bold hover:bg-[#00b34a] transition-colors shadow-sm disabled:opacity-40"
                        aria-label="Confirm container"
                    >
                        {confirming ? 'Confirming...' : '✓ Confirm'}
                    </button>
                </div>
            </div>

            <ConfirmModal
                open={showDiscardConfirm}
                title="Discard container?"
                message="All orders will be returned to the available pool. This cannot be undone."
                confirmLabel="Discard"
                onConfirm={() => { setShowDiscardConfirm(false); onDiscard(); }}
                onCancel={() => setShowDiscardConfirm(false)}
            />

            <ConfirmModal
                open={showLowWeightConfirm}
                title="Container below recommended weight"
                message={`This container has ${draft.totalPounds.toLocaleString()} lbs, below the recommended minimum of ${MIN_POUNDS_RECOMMENDED.toLocaleString()} lbs. Once confirmed it cannot be modified. Confirm anyway?`}
                confirmLabel="Confirm anyway"
                onConfirm={doConfirm}
                onCancel={() => setShowLowWeightConfirm(false)}
                loading={confirming}
            />
        </>
    );
}
