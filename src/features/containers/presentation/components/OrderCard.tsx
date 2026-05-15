
import { formatShortDate } from '../utils/weekFormatter';
import type { OrderSummary } from '../../domain/types/types';
import { useNavigate } from 'react-router-dom';

interface Props {
    order: OrderSummary;
    onAdd: (order: OrderSummary) => void;
}

/**
 * Card representing a single order in the Available Orders panel.
 *
 * - Normal variant: shows order details + "Add to container" button.
 * - Exceeds-limits variant: red background, no action button, warning message.
 */
export function OrderCard({ order, onAdd }: Props) {
    const navigate = useNavigate();

    const handleOpenEditModal = () => {
        navigate(`?editOrderDetails=${order.id}`);
    }

    if (order.exceedsLimits) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <span className="text-[11px] text-red-400 mr-1">⚠</span>
                        <span className="text-[11px] text-red-400">#{order.id}</span>
                        <span className="text-sm font-semibold text-red-800 ml-1">
                            {order.client?.name ?? '—'}
                        </span>
                    </div>
                    <span className="text-[11px] bg-red-100 text-red-600 rounded-md px-1.5 py-0.5 shrink-0 font-medium">
                        {formatShortDate(order.requiredByDate)}
                    </span>
                </div>

                <p className="text-xs text-red-500 truncate">
                    PO - {order.po}
                </p>

                <div className="flex justify-between text-xs text-red-600 font-medium">
                    <span>{order.totalPallets} pallets</span>
                    <span>{order.totalPounds.toLocaleString()} lbs</span>
                </div>

                <p className="text-[11px] text-red-400 pt-1 border-t border-red-200">
                    Exceeds container limits — manual review required
                </p>

                <button
                    type="button"
                    onClick={() => handleOpenEditModal()}
                    className="w-full mt-0.5 text-xs bg-red-500 font-semibold text-white border rounded-lg py-1.5 hover:bg-red-400 hover:text-white transition-all"
                    aria-label={`Add order #${order.id} to container`}
                >
                    Edit Order
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 hover:border-[#00C853]/50 hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <span className="text-[11px] text-slate-400">#{order.id}</span>
                    <span className="text-sm font-semibold text-slate-800 ml-1.5">
                        {order.client?.name ?? '—'}
                    </span>
                </div>
                <span className="text-[11px] bg-sky-50 text-sky-600 rounded-md px-1.5 py-0.5 shrink-0 font-medium border border-sky-100">
                    {order.status == 2 ? 'Sent' : 'Confirmed'}
                </span>
            </div>

            <p className="text-xs text-slate-400 truncate">
                PO - {order.po}
            </p>

            <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>{order.totalPallets} pallets</span>
                <span>{order.totalPounds.toLocaleString()} lbs</span>
            </div>

            <div className='space-y-3'>
                <button
                    type="button"
                    onClick={() => onAdd(order)}
                    className="w-full mt-0.5 text-xs font-semibold text-[#00C853] border border-[#00C853]/30 rounded-lg py-1.5 hover:bg-[#00C853] hover:text-white transition-all group-hover:border-[#00C853]"
                    aria-label={`Add order #${order.id} to container`}
                >
                    + Add to container
                </button>

                <button
                    type="button"
                    onClick={() => handleOpenEditModal()}
                    className="w-full mt-0.5 text-xs font-semibold text-[#00C853] border border-[#00C853]/30 rounded-lg py-1.5 hover:bg-[#00C853] hover:text-white transition-all group-hover:border-[#00C853]"
                    aria-label={`Add order #${order.id} to container`}
                >
                    Edit Order
                </button>
            </div>
        </div>
    );
}
