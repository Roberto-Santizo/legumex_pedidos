
import { useState } from 'react';
import { ContainerStatusFilter } from './ContainerStatusFilter';
import type { ContainerDetail } from '../../domain/types/types';

interface Props {
    containers: ContainerDetail[];
    onSelectContainer: (container: ContainerDetail) => void;
}

/**
 * "Containers this week" card — status filter + scrollable grid of container cards.
 * The grid scrolls internally past a fixed height so a busy week doesn't blow up the page layout.
 */
export function ContainersListPanel({ containers, onSelectContainer }: Props) {
    const [statusFilter, setStatusFilter] = useState<4 | 5 | null>(null);

    if (containers.length === 0) return null;

    // status 5 = carrier assigned, status 4 = in container but no carrier yet
    const counts = {
        status4: containers.filter((container) => container.carrier === null).length,
        status5: containers.filter((container) => container.carrier !== null).length,
    };

    const visibleContainers = statusFilter === null
        ? containers
        : statusFilter === 5
            ? containers.filter((container) => container.carrier !== null)
            : containers.filter((container) => container.carrier === null);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Containers this week ({visibleContainers.length}{visibleContainers.length !== containers.length ? `/${containers.length}` : ''})
                </p>
                <ContainerStatusFilter
                    activeStatus={statusFilter}
                    onSetStatus={setStatusFilter}
                    counts={counts}
                />
            </div>

            {visibleContainers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                    No containers match the selected filter.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1">
                    {visibleContainers.map((container) => (
                        <button
                            key={container.id}
                            type="button"
                            onClick={() => onSelectContainer(container)}
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
    );
}
