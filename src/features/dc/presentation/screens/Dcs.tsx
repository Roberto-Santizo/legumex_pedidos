import { dcsProvider, FiltersComponent, type Dc, type FiltersDcs } from "@/features/dc/dc";
import { CustomFilledButton, FilterButton, LoadingState, PageHeader, Pagination, Table, type Column } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";

const columns: Column<Dc>[] = [
  { header: 'ID', accessor: 'id', id: 'id', render: (value) => <span className="font-mono text-xs text-neutral-400">#{value}</span> },
  { header: 'Name', accessor: 'name', id: 'name', render: (value) => <span className="font-medium text-ink">{value}</span> },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Code', accessor: 'code', id: 'code' },
  { header: 'Warehouse', accessor: 'warehouse', id: 'warehouse' },
];

const initialFilters: FiltersDcs = { name: '', code: '', warehouse: '', client: '' };

export function Dcs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersDcs>(initialFilters);

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: dcs, isLoading } = useQuery({
    queryKey: ['getPaginatedDcs', rowsPerPage, page, filters],
    queryFn: () => dcsProvider.getPaginatedDcs({ limit: rowsPerPage, offset: page + 1, filters }),
  });

  const { handleSubmit, register, control, reset } = useForm<FiltersDcs>({ defaultValues: initialFilters });

  const onSubmit = (data: FiltersDcs) => {
    setFilters(data);
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    reset();
  }

  if (isLoading) return <LoadingState />
  if (dcs) return (
    <div className="space-y-6">
      <PageHeader
        title="Distribution centers"
        description="Delivery destinations per client and warehouse."
        actions={
          <>
            <FilterButton onClick={() => setOpen(true)} />
            <CustomFilledButton
              label="New DC"
              type="button"
              icon={<BiPlus size={18} />}
              onClick={() => navigate('/dcs/create')}
            />
          </>
        }
      />

      <Table
        columns={columns}
        data={dcs.data.response}
        footer={
          <Pagination
            count={dcs.data.total}
            setSearchParams={setSearchParams}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        }
      />

      <FiltersComponent
        isOpen={open}
        toggleMenu={setOpen}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={onSubmit}
        control={control}
        clearFilters={clearFilters}
      />
    </div>
  )
}
