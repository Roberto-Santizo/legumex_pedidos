
interface Props {
    activeStatus: 4 | 5 | null;
    onSetStatus: (status: 4 | 5 | null) => void;
    counts: { status4: number; status5: number };
}

const CHIPS = [
    {
        value: 4 as const,
        label: 'Status 4',
        sub: 'In Container',
        dot: 'bg-sky-400',
        active: 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200',
        inactive: 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100',
        zero: 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-default',
    },
    {
        value: 5 as const,
        label: 'Status 5',
        sub: 'Carrier Assigned',
        dot: 'bg-brand-500',
        active: 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20',
        inactive: 'bg-brand-500/10 text-brand-700 border-brand-500/30 hover:bg-brand-500/20',
        zero: 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-default',
    },
] as const;

export function ContainerStatusFilter({ activeStatus, onSetStatus, counts }: Props) {
    const countFor = (value: 4 | 5) => (value === 4 ? counts.status4 : counts.status5);

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest shrink-0">
                Logistics status:
            </span>

            {/* All chip */}
            <button
                type="button"
                onClick={() => onSetStatus(null)}
                className={`
                    flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
                    ${activeStatus === null
                        ? 'bg-neutral-700 text-white border-neutral-700 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700'
                    }
                `}
            >
                <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                All
                <span className="opacity-60">({counts.status4 + counts.status5})</span>
            </button>

            {CHIPS.map(({ value, label, sub, dot, active, inactive, zero }) => {
                const count = countFor(value);
                const isEmpty = count === 0;
                const isSelected = activeStatus === value;

                return (
                    <button
                        key={value}
                        type="button"
                        disabled={isEmpty}
                        onClick={() => onSetStatus(isSelected ? null : value)}
                        className={`
                            flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
                            ${isEmpty ? zero : isSelected ? active : inactive}
                        `}
                    >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isEmpty ? 'bg-neutral-300' : dot}`} />
                        {label}
                        <span className="opacity-60">· {sub}</span>
                        <span className={`ml-0.5 font-bold ${isEmpty ? 'opacity-40' : ''}`}>({count})</span>
                    </button>
                );
            })}
        </div>
    );
}
