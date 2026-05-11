import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { getWeekBounds, todayIso } from "@/features/containers/presentation/utils/weekFormatter";
import { ModalEditItem } from "./ModalEditItem";
import { OrderProductsTable } from "./OrderProductsTable";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ModalAddItem } from "./ModalAddItem";

export function EditOrderDetails({ id }: { id: string }) {
    const navigate = useNavigate();
    const notification = useNotification();
    const queryClient = useQueryClient();

    const [weekAnchor, _] = useState<string>(todayIso);
    const { start: weekStart } = getWeekBounds(new Date(weekAnchor + 'T12:00:00'));


    const { mutate, isPending } = useMutation({
        mutationFn: () => ordersProvider.confirmReceivedOrder(+id),
        onError: (err) => notification.error(err.message),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getOrderById', id] });
            queryClient.invalidateQueries({ queryKey: ['containers_weekView', weekStart] })
            navigate(location.pathname, { replace: true });
        }
    });

    const handleAddItem = () => {
        const params = new URLSearchParams(location.search);

        params.set('addItem', id.toString());

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    }

    const { data: order } = useQuery({
        queryKey: ['getOrderById', id],
        queryFn: () => ordersProvider.getOrderById(id)
    });

    if (order) return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border p-4 space-y-5">
                <p className="main_title mb-3">Items</p>
                <CustomFilledButton
                    label="Add Item"
                    type="button"
                    disabled={isPending}
                    onClick={() => handleAddItem()}
                />
                <OrderProductsTable id={id} />

                <CustomFilledButton
                    label="Confirm Order"
                    type="button"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => mutate()}
                />
            </div>

            <ModalEditItem client={order.client_id} dc={order.dc_id} transportType={order.transportType} />
            <ModalAddItem client={order.client_id} dc={order.dc_id} transportType={order.transportType} />
        </div>
    )
}
