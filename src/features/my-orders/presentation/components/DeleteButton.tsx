import { BiTrash } from "react-icons/bi";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/features/shared/shared";
import type { Order } from "../../my-orders"
import { useSearchParams } from "react-router-dom";

type Props = {
    id: Order['id'];
}

export function DeleteButton({ id }: Props) {
    const [searchParams, _] = useSearchParams();
    const page = Number(searchParams.get("page")) || 0;
    const rowsPerPage = Number(searchParams.get("limit")) || 10;
    const queryClient = useQueryClient();


    const notification = useNotification();

    const { mutate, isPending } = useMutation({
        mutationFn: () => ordersProvider.deleteOrderById(id),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getMyOrders', rowsPerPage, page] });
        }
    });
    return (
        <button disabled={isPending} onClick={() => mutate()} className="hover:cursor-pointer">
            <BiTrash size={25} />
        </button>
    )
}
