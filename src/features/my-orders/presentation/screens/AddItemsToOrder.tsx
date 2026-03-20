import { BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { ModalAddItem, OrderProductsTable, OrderTotalsComponent } from "@/features/my-orders/my-orders";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";

export function AddItemsToOrder() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();

  const { data: totals, isLoading } = useQuery({
    queryKey: ['getOrderTotals', id],
    queryFn: () => ordersProvider.getOrderTotals(id),
    enabled: !!id
  });

  const { data: items, isLoading: isLoadingItems } = useQuery({
    queryKey: ['getOrderProducts', id],
    queryFn: () => ordersProvider.getOrderProducts(id),
    enabled: !!id
  });
  
  if (isLoading || isLoadingItems) return <p>Loading...</p>

  if (totals && items) return (
    <div className="w-full space-y-5">
      <h1 className="main_title">Add Items To Order</h1>
      <OrderTotalsComponent orderTotals={totals} />

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Add Item"
          icon={<BiPlus className="text-white" />}
          type="button"
          onClick={() => navigate('?addItem=true')}
        />
      </div>

      <OrderProductsTable items={items} />

      <ModalAddItem />
    </div>
  )
}
