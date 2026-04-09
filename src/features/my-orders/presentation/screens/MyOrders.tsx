import { BiFile, BiPlus } from "react-icons/bi";
import { CustomFilledButton, Pagination, Table } from "@/features/shared/shared";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { ModalCreateOrder, ModalUploadFile, ordersColumns } from "@/features/my-orders/my-orders";
import { useQuery } from "@tanstack/react-query";

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

  const handleOpenUploadFile = () => {
    const params = new URLSearchParams(location.search);

    params.set("uploadFile", "true");

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (orders) return (
    <div className="space-y-5">
      <h1 className="main_title">My Orders</h1>

      <div className="flex w-full justify-end gap-5">
        <CustomFilledButton
          label="Create Order"
          type="button"
          icon={<BiPlus className="text-white" />}
          onClick={() => handleOpenCreateOrderModal()}
        />

        <CustomFilledButton
          label="Upload File"
          type="button"
          icon={<BiFile className="text-white" />}
          onClick={() => handleOpenUploadFile()}
        />
      </div>

      {orders.data.response.length > 0 && (
        <Table
          columns={ordersColumns}
          data={orders.data.response}
        />
      )}

      <ModalCreateOrder />
      <ModalUploadFile />

      <Pagination
        count={orders.data.total}
        page={page}
        rowsPerPage={rowsPerPage}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}