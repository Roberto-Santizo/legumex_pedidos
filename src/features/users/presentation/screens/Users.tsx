import { CustomFilledButton } from '@/features/shared/shared';
import { BiPlus } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export function Users() {
  const navigate = useNavigate();

  return (
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
    </div>
  )
}
