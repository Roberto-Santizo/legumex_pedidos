import { CustomFilledButton, useNotification } from "@/features/shared/shared";
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
    <div className="h-screen grid grid-cols-12 gap-4 p-4 bg-gray-100">
      <div className="col-span-9 bg-white rounded-xl shadow overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <OrderDocument
            order={order}
            products={products}
            totals={totals}
          />
        </PDFViewer>
      </div>


      {((user.role == 'administrative' || user.role == 'admin') && order.status == 2) && (
        <div className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Order Actions
          </h2>

          <div className="flex flex-col gap-2">
            <CustomFilledButton
              label="Confirm Received Order"
              type="button"
              disabled={isPending}
              onClick={() => mutate()}
            />
          </div>

          <div className="border-t pt-4 text-sm text-gray-600">
            <p><strong>Client:</strong> {order.client}</p>
            <p><strong>DC:</strong> {order.dc}</p>
            <p><strong>Creation Date:</strong> {order.date}</p>
          </div>

        </div>
      )}

      {order.status == 3 && (
        <div className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Order Information
          </h2>

          <div className="border-t pt-4 text-sm text-gray-600">
            <p><strong>Confirmed By:</strong> {order.confirmedBy}</p>
            <p><strong>Confirmation Date:</strong> {order.confirmationDate}</p>
          </div>

        </div>
      )}
    </div>
  );
}