import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useQuery } from "@tanstack/react-query";

type Props = {
    id: string;
}

export function OrderTotalsComponent({ id }: Props) {
    const { data: totals } = useQuery({
        queryKey: ['getOrderTotals', id],
        queryFn: () => ordersProvider.getOrderTotals(id),
        enabled: !!id
    });

    if (totals) return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Totales de la orden
            </h2>

            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Boxes</span>
                <span className="font-medium text-gray-900">
                    {totals.total_boxes}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pounds</span>
                <span className="font-bold text-green-600 text-lg">
                    {totals.total_lbs}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-green-600 text-lg">
                    {totals.total_price}
                </span>
            </div>

        </div>
    );
}