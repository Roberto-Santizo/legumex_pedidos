import { BiPlus } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { CustomFilledButton, Table, Tag, useNotification, type Column } from "@/features/shared/shared";
import { Link } from "react-router-dom";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Order } from "@/features/my-orders/my-orders";

const columns: Column<Order>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Ordered By', accessor: 'user', id: 'user' },
  { header: 'Created At', accessor: 'createdAt', id: 'createdAt' },
  {
    header: 'status',
    id: 'status',
    render: (_, row) => (
      <Tag status={row.status} />
    ),
  },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => {
      const url = row.status == 1 ? `/my-orders/addItems/${row.id}` : `/my-orders/${row.id}`;
      return (<Link to={url}>
        <BsFillEyeFill size={25} className="hover:text-gray-600" />
      </Link>);
    },
  },

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


      {orders.length > 0 && (
        <Table
          columns={columns}
          data={orders}
        />
      )}
    </div>
  )
}
