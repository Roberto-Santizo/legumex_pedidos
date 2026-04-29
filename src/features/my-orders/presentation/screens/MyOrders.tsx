import { BiFile, BiMenu, BiPlus } from "react-icons/bi";
import { CustomFilledButton, Pagination, Table } from "@/features/shared/shared";
import { FiltersComponent } from "@/features/my-orders/my-orders";
import { ModalCreateOrder, ModalUploadFile, ordersColumns, type OrderFilters } from "@/features/my-orders/my-orders";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const initialFilters: OrderFilters = { year: '', week: '', po: '', client: '', dc: '', transportType: '' };

export function MyOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

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

    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);


  const { data: orders, isLoading } = useQuery({
    queryKey: ['getMyOrders', rowsPerPage, page, filters],
    queryFn: () => ordersProvider.getPaginatedOrders({ limit: rowsPerPage, offset: page + 1, filters })
  });

  const { handleSubmit, register, control, reset } = useForm<OrderFilters>({ defaultValues: initialFilters })

  const onSubmit = (data: OrderFilters) => {
    setFilters(data);
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    reset();
  }

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
        <BiMenu size={40} onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-500" />
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

      <FiltersComponent
        control={control}
        clearFilters={clearFilters}
        handleSubmit={handleSubmit}
        isOpen={open}
        onSubmit={onSubmit}
        register={register}
        toggleMenu={setOpen}
      />
    </div>
  );
}