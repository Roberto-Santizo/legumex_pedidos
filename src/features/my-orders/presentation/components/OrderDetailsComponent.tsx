import { useParams } from "react-router-dom";
import type { OrderDetails } from "@/features/my-orders/my-orders";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useQuery } from "@tanstack/react-query";

type Props = {
    order: OrderDetails;
};

export function OrderDetailsComponent({ order }: Props) {
    const params = useParams();
    const id = params.id!;

    const { data: totals } = useQuery({
        queryKey: ["getOrderTotals", id],
        queryFn: () => ordersProvider.getOrderTotals(id),
        enabled: !!order.id,
    });

    if (totals) return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    Order Details
                </h2>
            </div>

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

            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Information
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <Info label="Client" value={order.client} />
                    <Info label="DC" value={order.dc} />
                    <Info label="Transport" value={order.transportType} />
                    <Info label="Created At" value={order.date} />
                    <Info label="Required By" value={order.requiredDate} />
                    <Info label="PO" value={order.po} />
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}