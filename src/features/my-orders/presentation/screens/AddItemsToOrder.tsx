import { BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { ModalAddItem, OrderProductsTable, OrderDetailsComponent } from "@/features/my-orders/my-orders";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ordersProvider } from "../providers/ordersRepositoryProvider";

export function AddItemsToOrder() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();

  const { data: order } = useQuery({
    queryKey: ["getOrderDetails", id],
    queryFn: () => ordersProvider.getOrderById(id),
    enabled: !!id,
  });

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

      <ModalAddItem client={order.client_id} />

      <CustomFilledButton
        label="Confirm Order"
        type="button"
        onClick={() => { console.log('confirm') }}
        fullWitdh={true}
      />
    </div>
  )
}
