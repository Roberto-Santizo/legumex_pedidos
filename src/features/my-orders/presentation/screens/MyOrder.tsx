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
  const { id = '' } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const notification = useNotification();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';
  const canConfirm = ['admin', 'administrative'].includes(user?.role ?? '');

  const { mutate, isPending } = useMutation({
    mutationFn: () => ordersProvider.confirmReceivedOrder(+id),
    onError: (err) => notification.error(err.message),
    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getOrderById', id] });
    }
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['getOrderById', id],
    queryFn: () => ordersProvider.getOrderById(id)
  });

  const { data: products } = useQuery({
    queryKey: ['getOrderProducts', id],
    queryFn: () => ordersProvider.getOrderProducts(id)
  });

  const { data: totals } = useQuery({
    queryKey: ['getOrderTotals', id],
    queryFn: () => ordersProvider.getOrderTotals(id)
  });

  if (isLoading) return <p>Loading...</p>;
  if (!order || !products || !totals || !user) return null;

  const showActions = canConfirm && order.status === 2;
  const showInfo = order.status === 3;
  const showSidebar = showActions || showInfo;

  return (
    <div className="h-screen flex gap-4 p-4 from-gray-100 to-gray-200">
      <div className={`flex flex-col gap-4 ${showSidebar ? 'w-3/4' : 'w-full'}`}>
        <div className="flex-1 bg-white/90 backdrop-blur rounded-2xl shadow-lg border overflow-hidden">
          <PDFViewer width="100%" height="100%">
            <OrderDocument order={order} products={products} totals={totals} />
          </PDFViewer>
        </div>

        {isAdmin && (
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border p-4">
            <p className="main_title mb-3">Items</p>
            <OrderProductsTable id={id} />
          </div>
        )}
      </div>

      {showSidebar && (
        <div className="w-1/4 flex flex-col gap-4">
          {showActions && (
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border p-5 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Order Actions
              </h2>

              <CustomFilledButton
                label="Confirm Received Order"
                type="button"
                disabled={isPending}
                onClick={() => mutate()}
              />

              <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
                <p><b>Client:</b> {order.client}</p>
                <p><b>DC:</b> {order.dc}</p>
                <p><b>Date:</b> {order.date}</p>
              </div>
            </div>
          )}

          {showInfo && (
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border p-5 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Order Information
              </h2>

              <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
                <p><b>Confirmed By:</b> {order.confirmedBy}</p>
                <p><b>Date:</b> {order.confirmationDate}</p>
              </div>
            </div>
          )}

        </div>
      )}

      <ModalEditItem
        client={order.client_id}
        transportType={order.transportType}
        dc={order.dc}
      />
    </div>
  );
}