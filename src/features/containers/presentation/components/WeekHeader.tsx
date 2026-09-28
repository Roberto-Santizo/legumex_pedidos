
import { useState, useEffect } from 'react';
import {getISOWeekNumber, getISOWeekYear, isoWeeksInYear } from '../utils/weekFormatter';
import type { WeekView } from '../../domain/types/types';

interface Props {
    weekStart: string;
    weekView: WeekView | null;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onGoToWeek: (week: number, year: number) => void;
}

/** Header card with week navigation and 4 KPI counters. */
export function WeekHeader({weekStart,weekView,onPreviousWeek,onNextWeek,onGoToWeek,
}: Props) {
    const anchorDate = new Date(weekStart + 'T12:00:00');
    const currentWeek = getISOWeekNumber(anchorDate);
    const currentYear = getISOWeekYear(anchorDate);
    const weeksInYear = isoWeeksInYear(currentYear);
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

    const [weekInput, setWeekInput] = useState(() => String(currentWeek).padStart(2, '0'));
    useEffect(() => {
        setWeekInput(String(currentWeek).padStart(2, '0'));
    }, [currentWeek]);
    const totalOrders = weekView
        ? weekView.availableOrders.length +
          weekView.containers.reduce((sum, container) => sum + container.orders.length, 0)
        : 0;

    const unassigned = weekView?.availableOrders.length ?? 0;
    const draftCount = weekView?.containers.filter((container) => container.status === 'draft').length ?? 0;
    const confirmedCount = weekView?.containers.filter((container) => container.status === 'confirmed').length ?? 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full bg-[#00C853] shrink-0" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Containers</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Max 20 pallets · 40,000 lbs per container
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Week navigator: prev / input / next */}
                    <div className="flex items-center gap-1 border border-slate-200 hover:border-[#00C853] rounded-xl px-2 py-2 bg-white shadow-sm transition-all">
                        <button
                            type="button"
                            onClick={onPreviousWeek}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#00C853] hover:bg-slate-50 transition-colors"
                            aria-label="Previous week"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex flex-col items-center leading-none px-2">
                            <span className="text-[10px] font-bold text-[#00C853] uppercase tracking-widest select-none mb-0.5">Week</span>
                            <input
                                type="number"
                                min={1}
                                max={weeksInYear}
                                value={weekInput}
                                onChange={(inputEvent) => setWeekInput(inputEvent.target.value)}
                                onBlur={() => {
                                    const parsed = parseInt(weekInput, 10);
                                    if (!isNaN(parsed) && parsed >= 1 && parsed <= weeksInYear) {
                                        onGoToWeek(parsed, currentYear);
                                    } else {
                                        setWeekInput(String(currentWeek).padStart(2, '0'));
                                    }
                                }}
                                onKeyDown={(keyEvent) => { if (keyEvent.key === 'Enter') keyEvent.currentTarget.blur(); }}
                                className="text-2xl font-bold text-slate-800 bg-transparent focus:outline-none w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                aria-label="Week number"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={onNextWeek}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#00C853] hover:bg-slate-50 transition-colors"
                            aria-label="Next week"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Year selector */}
                    <label className="relative flex items-center gap-2 border border-slate-200 hover:border-[#00C853] rounded-xl px-4 py-2.5 bg-white shadow-sm cursor-pointer transition-all">
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-bold text-[#00C853] uppercase tracking-widest select-none mb-0.5">Year</span>
                            <select
                                value={currentYear}
                                onChange={(yearSelectEvent) => onGoToWeek(currentWeek, Number(yearSelectEvent.target.value))}
                                className="appearance-none text-2xl font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer w-20"
                                aria-label="Jump to year"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <svg className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </label>

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
