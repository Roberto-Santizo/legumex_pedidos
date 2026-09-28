import type { OrderTotals } from "../../my-orders"

type Props = {
    totals: OrderTotals;
}

export function OrderTotalsComponent({ totals }: Props) {
    const stats = [
        { label: 'Boxes', value: totals.total_boxes },
        { label: 'Pounds', value: totals.total_lbs },
        { label: 'Pallets', value: totals.total_pallets },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-neutral-200/80 p-4">
                    <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-ink tabular-nums">{stat.value}</p>
                </div>
            ))}

            <div className="rounded-xl bg-brand-50 ring-1 ring-inset ring-brand-200 p-4">
                <p className="text-xs font-medium text-brand-700">Amount</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-brand-800 tabular-nums">${totals.total_price}</p>
            </div>
        </div>
    )
}
