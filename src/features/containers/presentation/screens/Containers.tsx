
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/features/shared/shared';
import { containersProvider } from '../providers/containersRepositoryProvider';
import { todayIso, getWeekBounds, getMondayOfISOWeek, getISOWeekNumber, getISOWeekYear } from '../utils/weekFormatter';
import { wouldExceedPounds } from '../utils/limits';
import { getErrorMessage } from '../utils/errors';
import {WeekHeader,TransportDcFilterChips,AvailableOrdersPanel,ContainerAssignmentPanel,AssignTransportContainerModal,ContainersListPanel,} from '../components/components';
import type { DraftContainer, OrderSummary, ContainerDetail } from '../../domain/types/types';
import { downloadTransportCostReport } from '../../infrastructure/infrastructure';
import { BiDownload } from 'react-icons/bi';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Re-computes totals on the draft from its current order list */
function recomputeDraft(draft: DraftContainer): DraftContainer {
    return {
        ...draft,
        totalPallets: draft.orders.reduce((sum, order) => sum + order.totalPallets, 0),
        totalPounds: draft.orders.reduce((sum, order) => sum + order.totalPounds, 0),
    };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * Main Containers screen.
 * Manages all state: week navigation, active transport filter, draft container,
 * auto-proposal, and modals.
 */
export function Containers() {
    const notify = useNotification();
    const queryClient = useQueryClient();

    // ── Week navigation ────────────────────────────────────────────────────────
    const [weekAnchor, setWeekAnchor] = useState<string>(todayIso);
    const { start: weekStart } = getWeekBounds(new Date(weekAnchor + 'T12:00:00'));

    const goToPreviousWeek = () => {
        const targetDate = new Date(weekStart + 'T12:00:00');
        targetDate.setDate(targetDate.getDate() - 7);
        setWeekAnchor(targetDate.toISOString().slice(0, 10));
    };

    const goToNextWeek = () => {
        const targetDate = new Date(weekStart + 'T12:00:00');
        targetDate.setDate(targetDate.getDate() + 7);
        setWeekAnchor(targetDate.toISOString().slice(0, 10));
    };


    const goToWeek = (week: number, year: number) => {
        const monday = getMondayOfISOWeek(year, week);
        setWeekAnchor(monday.toISOString().slice(0, 10));
    };

    // ── Data fetching ──────────────────────────────────────────────────────────
    const {
        data: weekView,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['containers_weekView', weekStart],
        queryFn: () => containersProvider.getWeekView(weekStart),
        staleTime: 0,            // always consider data stale so any invalidation triggers a fresh fetch
        refetchOnWindowFocus: true, // refresh when user returns to the tab
    });

    // Force immediate refetch (not just mark-stale) so the UI reflects the DB state right away
    const invalidateWeekView = () =>
        queryClient.refetchQueries({ queryKey: ['containers_weekView', weekStart] });

    // ── Transport+DC filter ────────────────────────────────────────────────────
    const [activeFilter, setActiveFilter] = useState<{ transportType: string } | null>(null);
    const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
    const [poFilter, setPoFilter] = useState<string>('');
    const [dcFilter, setDcFilter] = useState<string[]>([]);

    // ── Transport cost Excel report ────────────────────────────────────────────
    const [reportWeek, setReportWeek] = useState<number>(() => getISOWeekNumber(new Date(weekStart + 'T12:00:00')));
    const [reportYear, setReportYear] = useState<number>(() => getISOWeekYear(new Date(weekStart + 'T12:00:00')));
    const [downloadingReport, setDownloadingReport] = useState(false);

    const handleDownloadReport = async () => {
        setDownloadingReport(true);
        try {
            const monday = getMondayOfISOWeek(reportYear, reportWeek);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            const from = monday.toISOString().slice(0, 10);
            const to = sunday.toISOString().slice(0, 10);
            await downloadTransportCostReport({ from, to });
        } catch (err: unknown) {
            notify.error(getErrorMessage(err, 'Failed to generate the report.'));
        } finally {
            setDownloadingReport(false);
        }
    };
    
    // ── Draft container ────────────────────────────────────────────────────────
    const [draft, setDraft] = useState<DraftContainer | null>(null);

    /** Creates a fresh in-memory draft for the selected filter */
    const handleStartNewDraft = () => {
        if (!activeFilter) return;
        setDraft({
            transportType: activeFilter.transportType,
            weekStart,
            orders: [],
            totalPallets: 0,
            totalPounds: 0,
            persistedId: null,
        });
    };

    /**
     * Adds an order to the draft.
     * If the draft has already been persisted, also calls the API to add it server-side.
     */
    const handleAddOrder = async (order: OrderSummary) => {
        if (!draft) return;

        // Guard: reject if the order is already in a persisted container
        const alreadyInContainer = (weekView?.containers ?? []).some((container) =>
            container.orders.some((existingOrder) => existingOrder.id === order.id),
        );
        if (alreadyInContainer) {
            notify.error(`Order #${order.id} is already assigned to another container.`);
            return;
        }

        // Hard limit: block only if total weight would exceed 42,000 lbs
        if (wouldExceedPounds(draft.totalPounds, order.totalPounds)) {
            notify.error('Adding this order would exceed the maximum weight of 42,000 lbs.');
            return;
        }

        if (draft.persistedId !== null) {
            // Draft is already saved — add via API then refresh
            try {
                await containersProvider.addOrdersToContainer(draft.persistedId, [order.id]);
                const updated = await containersProvider.getContainerById(draft.persistedId);
                setDraft({
                    ...draft,
                    orders: updated.orders,
                    totalPallets: updated.totalPallets,
                    totalPounds: updated.totalPounds,
                });
                await invalidateWeekView();
            } catch (err: unknown) {
                notify.error(getErrorMessage(err, 'Failed to add order.'));
            }
        } else {
            // In-memory only — just append
            const updatedDraft = recomputeDraft({ ...draft, orders: [...draft.orders, order] });
            setDraft(updatedDraft);
        }
    };

    const handleRemoveOrder = async (orderId: number) => {
        if (!draft) return;

        if (draft.persistedId !== null) {
            try {
                await containersProvider.removeOrderFromContainer(draft.persistedId, orderId);
                const updated = await containersProvider.getContainerById(draft.persistedId);
                setDraft({
                    ...draft,
                    orders: updated.orders,
                    totalPallets: updated.totalPallets,
                    totalPounds: updated.totalPounds,
                });
                await invalidateWeekView();
            } catch (err: unknown) {
                notify.error(getErrorMessage(err, 'Failed to remove order.'));
            }
        } else {
            const updatedDraft = recomputeDraft({
                ...draft,
                orders: draft.orders.filter((order) => order.id !== orderId),
            });
            setDraft(updatedDraft);
        }
    };

    /** Discards the draft (deletes from DB if persisted, clears state regardless) */
    const handleDiscard = async () => {
        if (draft?.persistedId !== null && draft?.persistedId !== undefined) {
            try {
                await containersProvider.deleteContainer(draft.persistedId);
                await invalidateWeekView();
            } catch (err: unknown) {
                notify.error(getErrorMessage(err, 'Failed to delete container.'));
            }
        }
        setDraft(null);
    };

    /**
     * Persists the in-memory draft to the DB in a single API call.
     * The backend requires at least one orderIds entry, so this always
     * creates the container with its current orders included.
     * Returns the new container's DB id.
     */
    const persistDraft = async (): Promise<number> => {
        if (!draft) throw new Error('No active draft');
        if (draft.orders.length === 0) throw new Error('Add at least one order before saving');

        const { message, id } = await containersProvider.createContainer({
            transportType: draft.transportType,
            weekStart: draft.weekStart,
            orderIds: draft.orders.map((order) => order.id),
        });

        // Mark as persisted immediately so any retry won't try to create a duplicate
        setDraft((previousDraft) => (previousDraft ? { ...previousDraft, persistedId: id } : null));

        // Sync the draft orders/totals from the backend (best-effort, non-blocking on failure)
        try {
            const saved = await containersProvider.getContainerById(id);
            setDraft((previousDraft) =>
                previousDraft ? { ...previousDraft, persistedId: id, orders: saved.orders, totalPallets: saved.totalPallets, totalPounds: saved.totalPounds } : null,
            );
        } catch {
            // Container was created successfully; detail fetch failing doesn't block the confirm flow
        }

        await invalidateWeekView();
        notify.success(message);
        return id;
    };

    /** Saves the draft to the DB so the user can keep editing it later. */
    const handleSave = async () => {
        if (!draft) return;
        try {
            await persistDraft();
        } catch (err: unknown) {
            notify.error(getErrorMessage(err, 'Failed to save container.'));
        }
    };

    /**
     * Confirms the container.
     * If the draft was never saved, auto-persists it first (create + orders in one call),
     * then immediately confirms.
     */
    const handleConfirm = async () => {
        if (!draft) return;

        try {
            // Auto-save if the draft hasn't been persisted yet
            const containerId = draft.persistedId ?? await persistDraft();

            const result = await containersProvider.confirmContainer(containerId);
            if (result.warning) notify.error(result.warning);
            notify.success(result.message);
            setDraft(null);
            await invalidateWeekView();
        } catch (err: unknown) {
            notify.error(getErrorMessage(err, 'Failed to confirm container.'));
        }
    };

    // ── Container detail modal ─────────────────────────────────────────────────
    const [selectedContainer, setSelectedContainer] = useState<ContainerDetail | null>(null);

    const handleAssignCarrier = async (carrierId: number) => {
        if (!selectedContainer) return;
        const updated = await containersProvider.assignCarrier(selectedContainer.id, carrierId);
        setSelectedContainer(updated);
        invalidateWeekView();
    };

    const handleSetDeliverySchedule = async (deliveryDate: string, deliveryTime: string) => {
        if (!selectedContainer) return;
        const updated = await containersProvider.setDeliverySchedule(selectedContainer.id, deliveryDate, deliveryTime);
        setSelectedContainer(updated);
        invalidateWeekView();
    };

    // ── Derived state ──────────────────────────────────────────────────────────

    /**
     * Orders that are not yet in any container and match the current filter.
     * Excludes orders already added to the current in-memory draft.
     */
    const draftOrderIds = new Set(draft?.orders.map((order) => order.id) ?? []);

    // Build a set of every order already inside a persisted container (draft or confirmed).
    // This is a defensive client-side guard: the backend already filters these out of
    // availableOrders, but stale cache or a race condition could let one slip through.
    const persistedContainerOrderIds = new Set(
        (weekView?.containers ?? []).flatMap((container) => container.orders.map((order) => order.id)),
    );

    // Orders filtered by active transport type + warehouse (source for DC select options — no DC filter applied here)
    const ordersForDcOptions = (weekView?.availableOrders ?? []).filter(
        (order) =>
            (activeFilter === null || order.transportType === activeFilter.transportType) &&
            (warehouseFilter === null || order.warehouse === warehouseFilter),
    );

    const availableOrders = (weekView?.availableOrders ?? []).filter(
        (order) =>
            !draftOrderIds.has(order.id) &&
            !persistedContainerOrderIds.has(order.id) &&
            (warehouseFilter === null || order.warehouse === warehouseFilter) &&
            (activeFilter === null || order.transportType === activeFilter.transportType) &&
            (poFilter === '' || order.po?.toLowerCase().includes(poFilter.toLowerCase())) &&
            (dcFilter.length === 0 || (order.dc !== null && dcFilter.includes(order.dc))),
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-red-500">Failed to load week data. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <WeekHeader
                weekStart={weekStart}
                weekView={weekView ?? null}
                onPreviousWeek={goToPreviousWeek}
                onNextWeek={goToNextWeek}
                onGoToWeek={goToWeek}
            />

            <TransportDcFilterChips
                availableOrders={weekView?.availableOrders ?? []}
                ordersForDcOptions={ordersForDcOptions}
                activeFilter={activeFilter}
                onSetFilter={(filter) => {
                    setActiveFilter(filter);
                    setDcFilter([]);
                }}
                warehouseFilter={warehouseFilter}
                onWarehouseChange={(warehouse) => {
                    setWarehouseFilter(warehouse);
                    setDcFilter([]);
                    setActiveFilter(null);
                }}
                poFilter={poFilter}
                onPoChange={setPoFilter}
                dcFilter={dcFilter}
                onDcFilterChange={setDcFilter}
            />

            {/* Transport cost Excel report download */}
            <div className="flex items-center gap-2 flex-wrap bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 mr-1">Transport report:</span>
                <span className="text-xs text-slate-400">Week</span>
                <input
                    type="number"
                    min={1}
                    max={53}
                    value={reportWeek}
                    onChange={(weekInputEvent) => setReportWeek(Number(weekInputEvent.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 w-16 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-xs text-slate-400">Year</span>
                <input
                    type="number"
                    min={2024}
                    max={2100}
                    value={reportYear}
                    onChange={(yearInputEvent) => setReportYear(Number(yearInputEvent.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 w-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                    onClick={handleDownloadReport}
                    disabled={downloadingReport}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                    <BiDownload size={14} />
                    {downloadingReport ? 'Downloading...' : 'Excel'}
                </button>
            </div>

            {/* Confirmed / existing containers list */}
            <ContainersListPanel containers={weekView?.containers ?? []} onSelectContainer={setSelectedContainer} />

            {/* Main work area: available orders (left) + draft builder (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-150">
                <AvailableOrdersPanel
                    orders={availableOrders}
                    activeFilter={activeFilter}
                    onAddOrder={handleAddOrder}
                />

                <ContainerAssignmentPanel
                    draft={draft}
                    activeFilter={activeFilter}
                    onStartNewDraft={handleStartNewDraft}
                    onRemoveOrder={handleRemoveOrder}
                    onDiscard={handleDiscard}
                    onSave={handleSave}
                    onConfirm={handleConfirm}
                />
            </div>

            {/* Container detail modal */}
            <AssignTransportContainerModal
                container={selectedContainer}
                open={selectedContainer !== null}
                onClose={() => setSelectedContainer(null)}
                onAssignCarrier={handleAssignCarrier}
                onSetDeliverySchedule={handleSetDeliverySchedule}
            />

        </div>
    );
}
