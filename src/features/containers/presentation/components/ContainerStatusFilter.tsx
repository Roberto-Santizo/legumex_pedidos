
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
        zero: 'bg-slate-50 text-slate-400 border-slate-200 cursor-default',
    },
    {
        value: 5 as const,
        label: 'Status 5',
        sub: 'Carrier Assigned',
        dot: 'bg-[#00C853]',
        active: 'bg-[#00C853] text-white border-[#00C853] shadow-sm shadow-[#00C853]/20',
        inactive: 'bg-[#00C853]/10 text-[#009940] border-[#00C853]/30 hover:bg-[#00C853]/20',
        zero: 'bg-slate-50 text-slate-400 border-slate-200 cursor-default',
    },
] as const;

export function ContainerStatusFilter({ activeStatus, onSetStatus, counts }: Props) {
    const countFor = (value: 4 | 5) => (value === 4 ? counts.status4 : counts.status5);

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                Logistics status:
            </span>

            {/* All chip */}
            <button
                type="button"
                onClick={() => onSetStatus(null)}
                className={`
                    flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all
                    ${activeStatus === null
                        ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
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
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isEmpty ? 'bg-slate-300' : dot}`} />
                        {label}
                        <span className="opacity-60">· {sub}</span>
                        <span className={`ml-0.5 font-bold ${isEmpty ? 'opacity-40' : ''}`}>({count})</span>
                    </button>
                );
            })}
        </div>
    );
}
