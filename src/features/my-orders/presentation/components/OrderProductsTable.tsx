import { BiTrash } from "react-icons/bi";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/features/shared/shared";
import type { OrderItemDetails } from "../../my-orders";

type Props = {
    id: string;
};

export function OrderProductsTable({ id }: Props) {
    const { error, success } = useNotification();
    const queryClient = useQueryClient();


    const { mutate, isPending } = useMutation({
        mutationFn: (id: OrderItemDetails['id']) => ordersProvider.deleteOrderProduct(id),
        onError: (err) => {
            error(err.message);
        },
        onSuccess: (message) => {
            success(message);
            queryClient.invalidateQueries({ queryKey: ['getOrderTotals', id] });
            queryClient.invalidateQueries({ queryKey: ['getOrderProducts', id] });
        }
    });

    const { data: items } = useQuery({
        queryKey: ['getOrderProducts', id],
        queryFn: () => ordersProvider.getOrderProducts(id),
        enabled: !!id
    });

    if (items) return (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3 text-right">Total Boxes</th>
                        <th className="px-4 py-3 text-right">Total Pounds</th>
                        <th className="px-4 py-3 text-right">Total Amount</th>
                        <th className="px-4 py-3 text-right">Po</th>
                        <th className="px-4 py-3 text-right"></th>
                    </tr>
                </thead>

                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors shadow-xs">
                                <td className="px-4 py-3 font-medium text-gray-800">
                                    {item.product}
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                    {item.internationalCode}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    {item.total_boxes}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    {item.total_lbs}
                                </td>

                                <td className="px-4 py-3 text-right font-semibold text-green-600">
                                    ${item.total_amount}
                                </td>

                                <td className="px-4 py-3 text-right font-semibold">
                                    {item.po}
                                </td>

                                <td className="px-4 py-3 text-right font-semibold">
                                    <button disabled={isPending} type="button" className="hover:text-red-700 hover:cursor-pointer" onClick={() => mutate(item.id)}>
                                        <BiTrash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center py-6 text-gray-400"
                            >
                                No hay productos en esta orden
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}