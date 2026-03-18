import { BiPackage } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { CustomNavLink } from './CustomNavLink';

type Props = {
  className?: string;
}

export function CustomSideBar({ className }: Props) {
  return (
    <div className={className}>
      <CustomNavLink to='/home' label='Dashboard'>
        <HiHome size={25} />
      </CustomNavLink>

      <CustomNavLink to='/my-orders' label='My orders'>
        <BiPackage size={25} />
      </CustomNavLink>
    </div>
  )
}
