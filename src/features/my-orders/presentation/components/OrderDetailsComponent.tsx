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
        <div className="card p-5 w-full space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-4">
                <Info label="PO" value={order.po} />
                <Info label="Client" value={order.client} />
                <Info label="DC" value={order.dc} />
                <Info label="Transport" value={order.transportType} />
                <Info label="Created at" value={order.date} />
                <Info label="Required by" value={order.requiredDate} />
            </div>

            <div className="border-t border-neutral-100 pt-5">
                <OrderTotalsComponent totals={totals} />
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col min-w-0">
            <span className="text-xs text-neutral-500">{label}</span>
            <span className="mt-0.5 text-sm font-medium text-ink truncate">{value}</span>
        </div>
    );
}
