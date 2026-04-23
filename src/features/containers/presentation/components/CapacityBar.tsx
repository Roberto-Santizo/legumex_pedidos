// Created by Luis

import { usagePercent } from '../utils/limits';

interface Props {
    label: string;
    used: number;
    max: number;
    /** Optional note shown below the bar (e.g. "Recommended minimum: 20,000 lbs") */
    note?: string | null;
}

/** Color thresholds for the capacity fill bar */
function fillColor(percent: number): string {
    if (percent >= 100) return 'bg-red-600';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-green-700';
}

/**
 * Horizontal progress bar showing used/max capacity with dynamic color coding.
 * Green < 75% · Amber 75–99% · Red 100%
 */
export function CapacityBar({ label, used, max, note }: Props) {
    const percent = usagePercent(used, max);
    const remaining = Math.max(max - used, 0);

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-500">
                    {used.toLocaleString()} / {max.toLocaleString()} max
                </span>
            </div>

            {/* Progress bar */}
            <div
                className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={used}
                aria-valuemax={max}
                aria-label={label}
            >
                <div
                    className={`h-full rounded-full transition-all duration-300 ${fillColor(percent)}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-400">
                <span>{remaining.toLocaleString()} remaining</span>
                {note && <span className="text-amber-600">{note}</span>}
            </div>
        </div>
    );
}
