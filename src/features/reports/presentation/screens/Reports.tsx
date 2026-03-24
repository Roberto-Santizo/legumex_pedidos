import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { CustomFilledButton, DateFormField, SelectFormField, Table, type Column, type OrderFilters } from "@/features/shared/shared";
import { handleExportExcel } from "@/features/reports/reports";
import { ordersProvider } from "@/features/my-orders/presentation/providers/ordersRepositoryProvider";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Order } from "@/features/my-orders/my-orders";

const columns: Column<Order>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Dc', accessor: 'dc', id: 'dc' },
  { header: 'Total Lbs', accessor: 'total_lbs', id: 'total_lbs' },
  { header: 'Total Pallets', accessor: 'total_pallets', id: 'total_pallets' },
  { header: 'Total Price', accessor: 'total_price', id: 'total_price' },
  { header: 'Total Boxes', accessor: 'total_boxes', id: 'total_boxes' },
  { header: 'Transport Type', accessor: 'transportType', id: 'transportType' },
  { header: 'Required By Date', accessor: 'requiredByDate', id: 'requiredByDate' },
  { header: 'Confirmed By', accessor: 'confirmedBy', id: 'confirmedBy' },
];


export function Reports() {
  const { register, handleSubmit, formState: { errors }, control } = useForm<OrderFilters>();
  const [enabledQuery, setEnabledQuery] = useState<boolean>(false);
  const [filters, setFilters] = useState<OrderFilters>({ client: '', startDate: '', endDate: '' });

  const { data: clients } = useQuery({
    queryKey: ['getClients'],
    queryFn: () => clientsProvider.getClients()
  });

  const { data: orders } = useQuery({
    queryKey: ['getOrders', filters],
    queryFn: () => ordersProvider.getOrders(filters),
    enabled: enabledQuery
  });

  const onSubmit = (data: OrderFilters) => {
    setFilters(data);
    setEnabledQuery(true);
  };

  if (clients) return (
    <div className="p-6 space-y-6">
      <h1 className="main_title">Reports</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow p-4 grid grid-cols-4 gap-4 items-end"
      >
        <SelectFormField
          control={control}
          label="Client"
          name="client"
          options={clientOptions(clients)}
          validation={{}}
        />

        <DateFormField
          label="Start Date"
          name="startDate"
          register={register}
          validation={{ required: "Start date required" }}
          errorMessage={errors.startDate?.message}
        />

        <DateFormField
          label="End Date"
          name="endDate"
          register={register}
          validation={{ required: "End date required" }}
          errorMessage={errors.endDate?.message}
        />

        <CustomFilledButton
          label="Find"
          type="submit"
        />
      </form>

      <div>
        <div className="flex justify-end p-3">
          <CustomFilledButton
            label="Dowload Xlsx"
            type="button"
            onClick={() => handleExportExcel(orders ?? [])}
          />
        </div>
        <Table
          columns={columns}
          data={orders ?? []}
        />
      </div>
    </div>
  );
}