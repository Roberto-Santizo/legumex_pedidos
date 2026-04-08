import { BiPlus } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { CustomFilledButton, Pagination, Table, Tag, type Column } from "@/features/shared/shared";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { type Order, ModalCreateOrder  } from "@/features/my-orders/my-orders";
import { useQuery } from "@tanstack/react-query";

const columns: Column<Order>[] = [
  { header: 'Ordered By', accessor: 'user', id: 'user' },
  { header: 'Created At', accessor: 'createdAt', id: 'createdAt' },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Transaport Type', accessor: 'transportType', id: 'transportType' },
  {
    header: 'status',
    id: 'status',
    render: (_, row) => <Tag status={row.status} />,
  },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => {
      const url = row.status == 1
        ? `/my-orders/addItems/${row.id}`
        : `/my-orders/${row.id}`;

      return (
        <Link to={url}>
          <BsFillEyeFill size={25} className="hover:text-gray-600" />
        </Link>
      );
    },
  },
];

export function MyOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['getMyOrders', rowsPerPage, page],
    queryFn: () => ordersProvider.getPaginatedOrders(rowsPerPage, page + 1)
  });

  const handleOpenCreateOrderModal = () => {
    const params = new URLSearchParams(location.search);

    params.set("createOrder", "true");

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (orders) return (
    <div className="space-y-5">
      <h1 className="main_title">My Orders</h1>

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Create Order"
          type="button"
          icon={<BiPlus className="text-white" />}
          onClick={() => handleOpenCreateOrderModal()}
        />
      </div>

      {orders.data.response.length > 0 && (
        <Table
          columns={columns}
          data={orders.data.response}
        />
      )}

      <ModalCreateOrder />

      <Pagination
        count={orders.data.total}
        page={page}
        rowsPerPage={rowsPerPage}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}