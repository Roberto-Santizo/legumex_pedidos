import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { ModalEditItem, OrderProductsTable } from "../presentation";
import { OrderDocument } from "../components/OrderDocument";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { PDFViewer } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function MyOrder() {
  const params = useParams();
  const id = params.id!!;
  const user = useSelector((state: RootState) => state.auth.user);
  const notification = useNotification();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ordersProvider.confirmReceivedOrder(+id),
    onError: (err) => {
      notification.error(err.message);
    },
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getOrderById', id] });
    }
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['getOrderById', id],
    queryFn: () => ordersProvider.getOrderById(id!)
  });

  const { data: products } = useQuery({
    queryKey: ['getOrderProducts', id],
    queryFn: () => ordersProvider.getOrderProducts(id!)
  });

  const { data: totals } = useQuery({
    queryKey: ['getOrderTotals', id],
    queryFn: () => ordersProvider.getOrderTotals(id!)
  });

  if (isLoading) return <p>Loading...</p>
  if (order && products && totals && user) return (
    <div className="h-screen grid grid-cols-12 gap-4 p-4 from-gray-100 to-gray-200">

      <div className="col-span-9 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition hover:shadow-xl">
        <PDFViewer width="100%" height="100%">
          <OrderDocument
            order={order}
            products={products}
            totals={totals}
          />
        </PDFViewer>
      </div>

      {((user.role == 'administrative' || user.role == 'admin') && order.status == 2) && (
        <div className="col-span-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col gap-6 transition hover:shadow-xl">

          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
            Order Actions
          </h2>

          <div className="flex flex-col gap-3">
            <CustomFilledButton
              label="Confirm Received Order"
              type="button"
              disabled={isPending}
              onClick={() => mutate()}
            />
          </div>

          <div className="border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Client:</span> {order.client}</p>
            <p><span className="font-medium text-gray-700">DC:</span> {order.dc}</p>
            <p><span className="font-medium text-gray-700">Creation Date:</span> {order.date}</p>
          </div>

        </div>
      )}

      {(user.role == 'admin') && (
        <div className="col-span-12 space-y-5">
          <p className="main_title">Items</p>
          <div className="h-full bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition hover:shadow-xl">
            <OrderProductsTable id={id} />
          </div>
        </div>
      )}


      {order.status == 3 && (
        <div className="col-span-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col gap-6 transition hover:shadow-xl">

          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
            Order Information
          </h2>

          <div className="border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Confirmed By:</span> {order.confirmedBy}</p>
            <p><span className="font-medium text-gray-700">Confirmation Date:</span> {order.confirmationDate}</p>
          </div>

        </div>
      )}

      <ModalEditItem client={order.client_id} transportType={order.transportType} dc={order.dc}/>
    </div>
  );
}