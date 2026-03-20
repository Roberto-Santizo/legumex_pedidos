import { BiBox, BiPackage } from 'react-icons/bi';
import { CustomNavLink } from './CustomNavLink';
import { HiHome } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/config/config';

type Props = {
  className?: string;
}

export function CustomSideBar({ className }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className={className}>
      <CustomNavLink to='/home' label='Dashboard'>
        <HiHome size={25} />
      </CustomNavLink>

      <CustomNavLink to='/my-orders?page=1&rowsPerPage=10' label='My orders'>
        <BiPackage size={25} />
      </CustomNavLink>

      {user!.role == 'admin' && (
        <CustomNavLink to='/products' label='Products'>
          <BiBox size={25} />
        </CustomNavLink>
      )}
    </div>
  )
}
