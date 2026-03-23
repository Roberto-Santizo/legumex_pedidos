import { BiBox, BiPackage } from 'react-icons/bi';
import { BsFilePerson } from 'react-icons/bs';
import { CustomNavLink } from './CustomNavLink';
import { HiHome } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/config/config';

type Props = {
  className?: string;
}

export function CustomSideBar({ className }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) return (
    <div className={className}>
      <CustomNavLink to='/home' label='Dashboard'>
        <HiHome size={25} />
      </CustomNavLink>

      <CustomNavLink to='/my-orders' label='My orders'>
        <BiPackage size={25} />
      </CustomNavLink>

      {user.role == 'admin' && (
        <>
          <CustomNavLink to='/products' label='Products'>
            <BiBox size={25} />
          </CustomNavLink>
          <CustomNavLink to='/clients' label='Clients'>
            <BsFilePerson size={25} />
          </CustomNavLink>
        </>
      )}
    </div>
  )
}
