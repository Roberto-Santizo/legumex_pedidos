import { BiPencil, BiTrash } from "react-icons/bi";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/features/shared/shared";
import type { OrderItemDetails } from "@/features/my-orders/my-orders";

type Props = {
    id: string;
};

export function OrderProductsTable({ id }: Props) {
    const { error, success } = useNotification();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (itemId: OrderItemDetails['id']) => ordersProvider.deleteOrderProduct(+id, itemId),
        onError: (err) => {
            error(err.message);
        },
        onSuccess: (message) => {
            success(message);
            queryClient.invalidateQueries({ queryKey: ['getOrderTotals', id] });
            queryClient.invalidateQueries({ queryKey: ['getOrderProducts', id] });
        }
    });

    const handleDeleteItem = (id: number) => {
        mutate(id);
    }

    const handleEditItem = (id: number) => {
        const params = new URLSearchParams(location.search);

        params.set('editItem', id.toString());

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    }

    const { data: items } = useQuery({
        queryKey: ['getOrderProducts', id],
        queryFn: () => ordersProvider.getOrderProducts(id),
        enabled: !!id
    });

    if (items) return (
        <div className="card w-full overflow-x-auto thin_scroll">
            <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500 uppercase text-[11px] tracking-wider">
                    <tr>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap">Product</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap">Code</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap">Supplier Stock #</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap text-right">Total Boxes</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap text-right">Total Pounds</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap text-right">Total Amount</th>
                        <th className="px-5 py-3 font-semibold whitespace-nowrap text-right">Total Pallets</th>
                        <th className="px-5 py-3 w-0"></th>
                        <th className="px-5 py-3 w-0"></th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-ink">
                                    {item.product}
                                </td>

                                <td className="px-5 py-3.5 text-neutral-600">
                                    {item.internationalCode}
                                </td>

                                <td className="px-5 py-3.5 text-neutral-600">
                                    {item.supplierStock}
                                </td>

                                <td className="px-5 py-3.5 text-right">
                                    {item.total_boxes}
                                </td>

                                <td className="px-5 py-3.5 text-right">
                                    {item.total_lbs}
                                </td>

                                <td className="px-5 py-3.5 text-right font-semibold text-brand-700 tabular-nums">
                                    ${item.total_amount}
                                </td>

                                <td className="px-5 py-3.5 text-right">
                                    {item.total_pallets}
                                </td>

                                <td className="px-2 py-3.5 text-right w-0">
                                    <button disabled={isPending} type="button" className="icon_btn icon_btn_danger" title="Delete" onClick={() => handleDeleteItem(item.id)}>
                                        <BiTrash size={17} />
                                    </button>
                                </td>
                                <td className="px-2 py-3.5 text-right w-0">
                                    <button disabled={isPending} type="button" className="icon_btn" title="Edit" onClick={() => handleEditItem(item.id)}>
                                        <BiPencil size={17} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={9}
                                className="text-center py-14 text-sm text-neutral-400"
                            >
                                No items in this order yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}