import { BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { ModalAddItem } from "../components/ModalAddItem";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { OrderTotals } from "../components/OrderTotals";
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

  if (isLoading) return <p>Loading...</p>

  if (totals) return (
    <div className="w-full space-y-5">
      <h1 className="main_title">Add Items To Order</h1>
      <OrderTotals orderTotals={totals} />

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Add Item"
          icon={<BiPlus className="text-white" />}
          type="button"
          onClick={() => navigate('?addItem=true')}
        />
      </div>

      <ModalAddItem />
    </div>
  )
}
