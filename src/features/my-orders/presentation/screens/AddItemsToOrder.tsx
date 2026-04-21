import { BiPlus } from "react-icons/bi";
import { CustomFilledButton, useNotification } from '@/features/shared/shared';
import { ModalAddItem, OrderProductsTable, OrderDetailsComponent, ModalEditItem } from "@/features/my-orders/my-orders";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useEffect } from "react";

export function AddItemsToOrder() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();
  const notification = useNotification();
  const queryClient = useQueryClient();

  const { data: order } = useQuery({
    queryKey: ["getOrderDetails", id],
    queryFn: () => ordersProvider.getOrderById(id),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => ordersProvider.confirmOrder(+id),
    onError: (err) => {
      notification.error(err.message);
    },
    onSuccess: (message) => {
      notification.success(message);
      navigate('/my-orders');
      queryClient.invalidateQueries({ queryKey: ['getMyOrders'] })
    }
  });

  useEffect(() => {
    if (order && order.status != 1) {
      navigate('/my-orders');
    }
  }, [order]);

  if (order) return (
    <div className="w-full space-y-5">
      <h1 className="main_title">Add Items To Order</h1>
      <OrderDetailsComponent order={order} />

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Add Item"
          icon={<BiPlus className="text-white" />}
          type="button"
          onClick={() => navigate('?addItem=true')}
        />
      </div>

      <OrderProductsTable id={id} />

      <ModalAddItem client={order.client_id} transportType={order.transportType} dc={order.dc_id} />
      <ModalEditItem client={order.client_id} transportType={order.transportType} dc={order.dc_id} />

      <CustomFilledButton
        label="Confirm Order"
        type="button"
        onClick={() => { mutate() }}
        fullWitdh={true}
        disabled={isPending}
      />
    </div>
  )
}
