import { BiPencil, BiPlus } from 'react-icons/bi';
import { CustomFilledButton, FilterButton, LoadingState, PageHeader, Pagination, Table, type Column } from '@/features/shared/shared';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FiltersComponent, usersProvider, type FiltersUsers, type User } from '@/features/users/users';

const columns: Column<User>[] = [
  { header: 'ID', accessor: 'id', id: 'id', render: (value) => <span className="font-mono text-xs text-neutral-400">#{value}</span> },
  {
    header: 'Name',
    id: 'name',
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-xs font-semibold uppercase">
          {row.name.charAt(0)}{row.lastName?.charAt(0)}
        </div>
        <span className="font-medium text-ink">{row.name} {row.lastName}</span>
      </div>
    ),
  },
  { header: 'Email', accessor: 'email', id: 'email' },
  {
    header: 'Role',
    accessor: 'role',
    id: 'role',
    render: (value) => (
      <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700 capitalize">{value}</span>
    ),
  },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => (
      <Link to={`/users/update/${row.id}`} className="icon_btn" title="Edit">
        <BiPencil size={17} />
      </Link>
    ),
  },
];

const initialFilters: FiltersUsers = { name: '', lastName: '', email: '', role: '' };

export function Users() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersUsers>(initialFilters);

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: users, isLoading } = useQuery({
    queryKey: ['getPaginatedUsers', rowsPerPage, page, filters],
    queryFn: () => usersProvider.getPaginatedUsers({ limit: rowsPerPage, offset: page + 1, filters })
  });

  const { handleSubmit, register, control, reset } = useForm<FiltersUsers>({ defaultValues: initialFilters });

  const onSubmit = (data: FiltersUsers) => {
    setFilters(data);
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    reset();
  }

  if (isLoading) return <LoadingState />
  if (users) return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="People with access to the platform and their roles."
        actions={
          <>
            <FilterButton onClick={() => setOpen(true)} />
            <CustomFilledButton
              label='New user'
              type='button'
              icon={<BiPlus size={18} />}
              onClick={() => navigate('/users/create')}
            />
          </>
        }
      />

      <Table
        columns={columns}
        data={users.data.response}
        footer={
          <Pagination
            count={users.data.total}
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
