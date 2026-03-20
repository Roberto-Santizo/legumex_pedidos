import type { OrderTotals } from "../../my-orders"

type Props = {
    orderTotals: OrderTotals;
}

export function OrderTotalsComponent({ orderTotals }: Props) {
    const { total_boxes, total_price } = orderTotals;

    const formattedPrice = new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(total_price));

    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Totales de la orden
            </h2>

            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Boxes</span>
                <span className="font-medium text-gray-900">
                    {total_boxes}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-green-600 text-lg">
                    {formattedPrice}
                </span>
            </div>
        </div>
    );
}