import type { OrderTotals } from "../../my-orders"

type Props = {
    totals: OrderTotals;
}

export function OrderTotalsComponent({ totals }: Props) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Totals
            </h3>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Boxes</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {totals.total_boxes}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Pounds</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {totals.total_lbs}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Pallets</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {totals.total_pallets}
                    </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-green-600">Amount</p>
                    <p className="text-lg font-bold text-green-700">
                        ${totals.total_price}
                    </p>
                </div>
            </div>
        </div>
    )
}
