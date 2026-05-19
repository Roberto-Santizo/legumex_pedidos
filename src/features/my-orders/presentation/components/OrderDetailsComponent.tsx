import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OrderTotalsComponent, type OrderDetails } from "@/features/my-orders/my-orders";

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

            <OrderTotalsComponent totals={totals} />

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