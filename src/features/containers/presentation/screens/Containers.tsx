
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/features/shared/shared';
import { containersProvider } from '../providers/containersRepositoryProvider';
import { todayIso, getWeekBounds, getMondayOfISOWeek } from '../utils/weekFormatter';
import { wouldExceedPounds } from '../utils/limits';
import {WeekHeader,TransportDcFilterChips,AvailableOrdersPanel,ContainerBuilderPanel,ContainerDetailModal,ContainerStatusFilter,} from '../components/components';
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
    const { start: weekStart, end: weekEnd } = getWeekBounds(new Date(weekAnchor + 'T12:00:00'));

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

    const goToToday = () => setWeekAnchor(todayIso());

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
    const [activeFilter, setActiveFilter] = useState<{ transportType: string; dc: string } | null>(null);
    const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
    const [transportTypeFilter, setTransportTypeFilter] = useState<string | null>(null);
    const [poFilter, setPoFilter] = useState<string>('');

    // ── Transport cost Excel report ────────────────────────────────────────────
    const [reportFrom, setReportFrom]           = useState<string>(weekStart);
    const [reportTo, setReportTo]               = useState<string>(weekEnd);
    const [downloadingReport, setDownloadingReport] = useState(false);

    const handleDownloadReport = async () => {
        if (!reportFrom || !reportTo) return;
        setDownloadingReport(true);
        try {
            await downloadTransportCostReport({ from: reportFrom, to: reportTo });
        } catch (err: unknown) {
            notify.error(err instanceof Error ? err.message : 'Failed to generate the report.');
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
            dc: activeFilter.dc,
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
                notify.error(err instanceof Error ? err.message : 'Failed to add order.');
            }
        } else {
            // In-memory only — just append
            const updatedDraft = recomputeDraft({ ...draft, orders: [...draft.orders, order] });
            setDraft(updatedDraft);
        }
    };

    /** Removes an order from the draft (in-memory or via API if persisted) */
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
                notify.error(err instanceof Error ? err.message : 'Failed to remove order.');
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
                notify.error(err instanceof Error ? err.message : 'Failed to delete container.');
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
            dc: draft.dc,
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
            notify.error(err instanceof Error ? err.message : 'Failed to save container.');
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
            notify.error(err instanceof Error ? err.message : 'Failed to confirm container.');
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

    const availableOrders = (weekView?.availableOrders ?? []).filter(
        (order) =>
            !draftOrderIds.has(order.id) &&
            !persistedContainerOrderIds.has(order.id) &&
            (warehouseFilter === null || order.warehouse === warehouseFilter) &&
            (transportTypeFilter === null || order.transportType === transportTypeFilter) &&
            (poFilter === '' || order.po?.toLowerCase().includes(poFilter.toLowerCase())),
    );

    // ── Container logistics status filter ──────────────────────────────────────
    const [containerStatusFilter, setContainerStatusFilter] = useState<4 | 5 | null>(null);

    const allContainers = weekView?.containers ?? [];
    // status 5 = carrier assigned, status 4 = in container but no carrier yet
    const containerStatusCounts = {
        status4: allContainers.filter((container) => container.carrier === null).length,
        status5: allContainers.filter((container) => container.carrier !== null).length,
    };
    const visibleContainers = containerStatusFilter === null
        ? allContainers
        : containerStatusFilter === 5
            ? allContainers.filter((container) => container.carrier !== null)
            : allContainers.filter((container) => container.carrier === null);

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
            {/* Week navigation + KPI header */}
            <WeekHeader
                weekStart={weekStart}
                weekEnd={weekEnd}
                weekView={weekView ?? null}
                onPreviousWeek={goToPreviousWeek}
                onNextWeek={goToNextWeek}
                onToday={goToToday}
                onGoToWeek={goToWeek}
            />


            {/* Transport + DC filter chips */}
            <TransportDcFilterChips
                availableOrders={weekView?.availableOrders ?? []}
                activeFilter={activeFilter}
                onSetFilter={setActiveFilter}
                warehouseFilter={warehouseFilter}
                onWarehouseChange={(warehouse) => {
                    setWarehouseFilter(warehouse);
                    if (warehouse !== null) setActiveFilter(null);
                }}
                transportTypeFilter={transportTypeFilter}
                onTransportTypeChange={(type) => {
                    setTransportTypeFilter(type);
                    setActiveFilter(null);
                }}
                poFilter={poFilter}
                onPoChange={setPoFilter}
            />

            {/* Transport cost Excel report download */}
            <div className="flex items-center gap-2 flex-wrap bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 mr-1">Transport report:</span>
                <input
                    type="date"
                    value={reportFrom}
                    onChange={(reportFromInputEvent) => setReportFrom(reportFromInputEvent.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-slate-400 text-xs">—</span>
                <input
                    type="date"
                    value={reportTo}
                    onChange={(reportToInputEvent) => setReportTo(reportToInputEvent.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                    onClick={handleDownloadReport}
                    disabled={downloadingReport || !reportFrom || !reportTo}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                    <BiDownload size={14} />
                    {downloadingReport ? 'Downloading...' : 'Excel'}
                </button>
            </div>

            {/* Confirmed / existing containers list */}
            {allContainers.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Containers this week ({visibleContainers.length}{visibleContainers.length !== allContainers.length ? `/${allContainers.length}` : ''})
                        </p>
                        <ContainerStatusFilter
                            activeStatus={containerStatusFilter}
                            onSetStatus={setContainerStatusFilter}
                            counts={containerStatusCounts}
                        />
                    </div>

                    {visibleContainers.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">
                            No containers match the selected filter.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {visibleContainers.map((container) => (
                                <button
                                    key={container.id}
                                    type="button"
                                    onClick={() => setSelectedContainer(container)}
                                    className="text-left border border-slate-200 rounded-xl p-3.5 hover:border-[#00C853] hover:shadow-md transition-all group bg-white"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-[#00C853] transition-colors">
                                                #C-{container.id}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {container.transportType}{container.dc ? ` · ${container.dc}` : ''}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 shrink-0 ${
                                                container.status === 'confirmed'
                                                    ? 'bg-[#00C853] text-white'
                                                    : 'bg-[#00C853]/15 text-[#009940]'
                                            }`}
                                        >
                                            {container.status === 'confirmed' ? '✓ CONFIRMED' : 'DRAFT'}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 text-[11px] font-medium text-slate-400 border-t border-slate-100 pt-2">
                                        <span>{container.totalOrders} orders</span>
                                        <span className="text-slate-300">·</span>
                                        <span>{container.totalPallets} pal</span>
                                        <span className="text-slate-300">·</span>
                                        <span>{container.totalPounds.toLocaleString()} lbs</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main work area: available orders (left) + draft builder (right) */}
            {(
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-150">
                    <AvailableOrdersPanel
                        orders={availableOrders}
                        activeFilter={activeFilter}
                        onAddOrder={handleAddOrder}
                    />

                    <ContainerBuilderPanel
                        draft={draft}
                        activeFilter={activeFilter}
                        onStartNewDraft={handleStartNewDraft}
                        onRemoveOrder={handleRemoveOrder}
                        onDiscard={handleDiscard}
                        onSave={handleSave}
                        onConfirm={handleConfirm}
                    />
                </div>
            )}

            {/* Container detail modal */}
            <ContainerDetailModal
                container={selectedContainer}
                open={selectedContainer !== null}
                onClose={() => setSelectedContainer(null)}
                onAssignCarrier={handleAssignCarrier}
                onSetDeliverySchedule={handleSetDeliverySchedule}
            />

        </div>
    );
}
