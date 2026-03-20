import { BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { ModalAddItem, OrderProductsTable, OrderTotalsComponent } from "@/features/my-orders/my-orders";
import { useNavigate, useParams } from "react-router-dom";

export function AddItemsToOrder() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-5">
      <h1 className="main_title">Add Items To Order</h1>
      <OrderTotalsComponent id={id} />

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Add Item"
          icon={<BiPlus className="text-white" />}
          type="button"
          onClick={() => navigate('?addItem=true')}
        />
      </div>

      <OrderProductsTable id={id} />

      <ModalAddItem />

      <CustomFilledButton
        label="Confirm Order"
        type="button"
        onClick={() => { console.log('confirm') }}
        fullWitdh={true}
      />
    </div>
  )
}
