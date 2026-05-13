// Created by Luis

import { formatWeekRange, getISOWeekNumber, getISOWeekYear, isoWeeksInYear } from '../utils/weekFormatter';
import type { WeekView } from '../../domain/types/types';

interface Props {
    weekStart: string;
    weekEnd: string;
    weekView: WeekView | null;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
    onGoToWeek: (week: number, year: number) => void;
}

/** Header card with week navigation and 4 KPI counters. */
export function WeekHeader({
    weekStart,
    weekEnd,
    weekView,
    onPreviousWeek,
    onNextWeek,
    onToday,
    onGoToWeek,
}: Props) {
    const anchorDate = new Date(weekStart + 'T12:00:00');
    const currentWeek = getISOWeekNumber(anchorDate);
    const currentYear = getISOWeekYear(anchorDate);
    const weeksInYear = isoWeeksInYear(currentYear);
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1];
    const totalOrders = weekView
        ? weekView.availableOrders.length +
          weekView.containers.reduce((s, c) => s + c.orders.length, 0)
        : 0;

    const unassigned = weekView?.availableOrders.length ?? 0;
    const draftCount = weekView?.containers.filter((c) => c.status === 'draft').length ?? 0;
    const confirmedCount = weekView?.containers.filter((c) => c.status === 'confirmed').length ?? 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Title + navigation */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    {/* Green accent bar */}
                    <div className="w-1 h-10 rounded-full bg-[#00C853] shrink-0" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Containers</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Max 20 pallets · 40,000 lbs per container
                        </p>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Containers</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Max 20 pallets · 40,000 lbs per container
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onPreviousWeek}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
                        aria-label="Previous week"
                    >
                        ◀
                    </button>

                    <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-700 font-medium select-none">
                        {formatWeekRange(weekStart, weekEnd)}
                    </span>

                    <button
                        type="button"
                        onClick={onNextWeek}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
                        aria-label="Next week"
                    >
                        ▶
                    </button>

                    {/* Week number jump selector */}
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
                        <span className="text-xs font-semibold text-slate-400 select-none">Wk</span>
                        <select
                            value={currentWeek}
                            onChange={(e) => onGoToWeek(Number(e.target.value), currentYear)}
                            className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                            aria-label="Jump to week"
                        >
                            {Array.from({ length: weeksInYear }, (_, i) => i + 1).map((w) => (
                                <option key={w} value={w}>
                                    {w}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year selector */}
                    <select
                        value={currentYear}
                        onChange={(e) => onGoToWeek(currentWeek, Number(e.target.value))}
                        className="text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none cursor-pointer"
                        aria-label="Jump to year"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={onToday}
                        className="px-4 py-1.5 rounded-lg bg-[#00C853] text-white text-sm font-semibold hover:bg-[#00b34a] transition-colors shadow-sm"
                        aria-label="Go to current week"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4">
                <KpiCard label="Total orders" value={totalOrders} />
                <KpiCard label="Unassigned" value={unassigned} accent="amber" />
                <KpiCard label="Draft" value={draftCount} accent="teal" />
                <KpiCard label="Confirmed" value={confirmedCount} accent="green" />
            </div>
        </div>
    );
}

function KpiCard({
    label,
    value,
    accent = 'default',
}: {
    label: string;
    value: number;
    accent?: 'default' | 'amber' | 'green' | 'teal';
}) {
    const valueClass = {
        default: 'text-slate-800',
        amber:   'text-amber-500',
        green:   'text-[#00C853]',
        teal:    'text-teal-500',
    }[accent];

    const dotClass = {
        default: 'bg-slate-300',
        amber:   'bg-amber-400',
        green:   'bg-[#00C853]',
        teal:    'bg-teal-400',
    }[accent];

    return (
        <div className="px-5 py-4 border-r border-slate-100 last:border-r-0 bg-white hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            </div>
            <p className={`text-3xl font-bold leading-tight ${valueClass}`}>{value}</p>
        </div>
    );
}
