import { BiMenu, BiPencil, BiPlus } from 'react-icons/bi';
import { CustomFilledButton, Pagination, Table, type Column } from '@/features/shared/shared';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FiltersComponent, usersProvider, type FiltersUsers, type User } from '@/features/users/users';

const columns: Column<User>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Name', accessor: 'name', id: 'name' },
  { header: 'lastName', accessor: 'lastName', id: 'lastName' },
  { header: 'Email', accessor: 'email', id: 'email' },
  { header: 'Role', accessor: 'role', id: 'role' },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => (
      <Link to={`/users/update/${row.id}`}>
        <BiPencil size={25} className="hover:text-gray-600" />
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

  if (isLoading) return <p>Loading...</p>
  if (users) return (
    <div className="space-y-5">
      <h1 className="main_title">Users</h1>

      <div className="flex w-full items-end flex-col gap-5">
        <BiMenu size={40} onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-500" />

        <CustomFilledButton
          label='Create User'
          type='button'
          icon={<BiPlus className='text-white' />}
          onClick={() => navigate('/users/create')}
        />
      </div>

      <Table
        columns={columns}
        data={users.data.response}
      />

      <Pagination
        count={users.data.total}
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
