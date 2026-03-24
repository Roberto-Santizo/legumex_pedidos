import { BiPencil, BiPlus } from 'react-icons/bi';
import { CustomFilledButton, Table, type Column } from '@/features/shared/shared';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersProvider, type User } from '@/features/users/users';

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

export function Users() {
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['getUsers'],
    queryFn: () => usersProvider.getUsers()
  });

  if (isLoading) return <p>Loading...</p>
  if (users) return (
    <div>
      <h1 className="main_title">Users</h1>

      <div className="flex justify-end">
        <CustomFilledButton
          label='Create User'
          type='button'
          icon={<BiPlus className='text-white' />}
          onClick={() => navigate('/users/create')}
        />
      </div>


      <Table
        columns={columns}
        data={users}
      />
    </div>
  )
}
