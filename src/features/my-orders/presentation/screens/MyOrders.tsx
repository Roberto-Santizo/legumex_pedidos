import { BiPlus, BiUpload } from "react-icons/bi";
import { CustomFilledButton, FilterButton, LoadingState, PageHeader, Pagination, Table } from "@/features/shared/shared";
import { FiltersComponent, ModalEditOrder } from "@/features/my-orders/my-orders";
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

  if (isLoading) return <LoadingState />;
  if (orders) return (
    <div className="space-y-6">
      <PageHeader
        title="My orders"
        description="Create, track and manage purchase orders by week."
        actions={
          <>
            <FilterButton onClick={() => setOpen(true)} />
            <CustomFilledButton
              label="Upload file"
              type="button"
              variant="secondary"
              icon={<BiUpload size={18} />}
              onClick={() => handleOpenUploadFile()}
            />
            <CustomFilledButton
              label="New order"
              type="button"
              icon={<BiPlus size={18} />}
              onClick={() => handleOpenCreateOrderModal()}
            />
          </>
        }
      />

      <Table
        columns={ordersColumns}
        data={orders.data.response}
        emptyMessage="No orders match the current filters"
        footer={
          <Pagination
            count={orders.data.total}
            page={page}
            rowsPerPage={rowsPerPage}
            setSearchParams={setSearchParams}
          />
        }
      />

      <ModalCreateOrder />
      <ModalEditOrder filters={filters} />
      <ModalUploadFile />

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