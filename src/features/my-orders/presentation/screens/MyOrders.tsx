import { BiPlus } from "react-icons/bi";
import { CustomFilledButton, Table, useNotification, type Column } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Order } from "@/features/my-orders/my-orders";

const columns: Column<Order>[] = [
  { header: 'id', accessor: 'id' },
  { header: 'Ordered By', accessor: 'user' },
  { header: 'Created At', accessor: 'createdAt' },

];

export function MyOrders() {
  const { error, success } = useNotification();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['getMyOrders'],
    queryFn: () => ordersProvider.getOrders()
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => ordersProvider.createOrder(),
    onError: (err) => {
      error(err.message);
    },
    onSuccess: (message) => {
      success(message);
      refetch();
    }
  });

  if (isLoading) return <p>Loading...</p>

  if (orders) return (
    <div className="space-y-5">
      <h1 className="main_title">My Orders</h1>

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Create Order"
          type="button"
          onClick={() => mutate()}
          icon={<BiPlus className="text-white" />}
          disabled={isPending}
        />
      </div>

      <Table
        columns={columns}
        data={orders}
      />
    </div>
  )
}
