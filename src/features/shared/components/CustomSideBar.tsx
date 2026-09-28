import { BiBox, BiFile, BiLogOut, BiMap, BiPackage, BiUser } from 'react-icons/bi';
import { BsCurrencyDollar, BsFilePerson, BsTruck } from 'react-icons/bs';
import { CustomNavLink } from './CustomNavLink';
import { HiOutlineHome } from 'react-icons/hi';
import { logout } from '@/features/login/login';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/config/config';
import logoMark from '@/assets/imgs/logo-mark.png';

type Props = {
  className?: string;
}

export function CustomSideBar({ className }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  if (user) return (
    <div className={className}>
      <div className="h-16 shrink-0 flex items-center gap-2.5 px-5 border-b border-neutral-200/80">
        <img src={logoMark} alt="Legumex" className="h-7 w-auto" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">Legumex</p>
          <p className="text-[11px] text-neutral-400">Orders</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto thin_scroll px-3 py-5 space-y-6">
        <div className="space-y-0.5">
          <CustomNavLink to='/home' label='Dashboard'>
            <HiOutlineHome />
          </CustomNavLink>

          <CustomNavLink to='/my-orders' label='My orders'>
            <BiPackage />
          </CustomNavLink>

          {user.role == 'admin' && (
            <CustomNavLink to='/users' label='Users'>
              <BiUser />
            </CustomNavLink>
          )}
        </div>

        {(user.role == 'administrator' || user.role == 'admin') && (
          <>
            <div className="space-y-0.5">
              <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">Catalog</p>

              <CustomNavLink to='/products' label='Products'>
                <BiBox />
              </CustomNavLink>

              <CustomNavLink to='/clients' label='Clients'>
                <BsFilePerson />
              </CustomNavLink>

              <CustomNavLink to='/dcs' label='DCs'>
                <BiMap />
              </CustomNavLink>
            </div>

            <div className="space-y-0.5">
              <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">Logistics</p>

              <CustomNavLink to='/containers' label='Containers'>
                <BsTruck />
              </CustomNavLink>

              <CustomNavLink to='/transportation-cost' label='Transportation cost'>
                <BsCurrencyDollar />
              </CustomNavLink>

              <CustomNavLink to='/reports' label='Reports'>
                <BiFile />
              </CustomNavLink>
            </div>
          </>
        )}
      </nav>

      <div className="shrink-0 p-3 border-t border-neutral-200/80">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="size-9 shrink-0 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-sm font-semibold uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            title="Log out"
            onClick={() => dispatch(logout())}
            className="icon_btn icon_btn_danger"
          >
            <BiLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
