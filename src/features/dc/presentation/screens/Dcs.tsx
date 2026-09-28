import { dcsProvider, FiltersComponent, type Dc, type FiltersDcs } from "@/features/dc/dc";
import { CustomFilledButton, Pagination, Table, type Column } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiMenu, BiPlus } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";

const columns: Column<Dc>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Name', accessor: 'name', id: 'name' },
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

  if (isLoading) return <p>Loading...</p>
  if (dcs) return (
    <div className="space-y-5">
      <h1 className="main_title">Dcs</h1>

      <div className="flex w-full items-end flex-col gap-5">
        <BiMenu size={40} onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-500" />

        <CustomFilledButton
          label="Create Dc"
          type="button"
          icon={<BiPlus className="text-white" size={25} />}
          onClick={() => navigate('/dcs/create')}
        />
      </div>

      <Table
        columns={columns}
        data={dcs.data.response}
      />

      <Pagination
        count={dcs.data.total}
        setSearchParams={setSearchParams}
        page={page}
        rowsPerPage={rowsPerPage}
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
