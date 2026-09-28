import { BiBox, BiChevronRight, BiMap, BiPackage, BiPlus } from "react-icons/bi";
import { BsFilePerson } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "@/config/config";
import { CustomFilledButton, PageHeader, statusMap, Tag } from "@/features/shared/shared";
import { ordersProvider } from "@/features/my-orders/presentation/providers/ordersRepositoryProvider";
import { productsProvider } from "@/features/products/products";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { dcsProvider } from "@/features/dc/dc";

const RECENT_LIMIT = 50;

const statusBarColor: Record<number, string> = {
  1: 'bg-amber-400',
  2: 'bg-sky-500',
  3: 'bg-brand-500',
  4: 'bg-violet-500',
  5: 'bg-teal-600',
};

export function Home() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user)!;
  const isManager = user.role === 'admin' || user.role === 'administrator';

  const { data: orders } = useQuery({
    queryKey: ['getMyOrders', RECENT_LIMIT, 0, 'dashboard'],
    queryFn: () => ordersProvider.getPaginatedOrders({
      limit: RECENT_LIMIT,
      offset: 1,
      filters: { year: '', week: '', po: '', client: '', dc: '', transportType: '' },
    }),
  });

  const { data: products } = useQuery({
    queryKey: ['getPaginatedProducts', 1, 0, 'dashboard'],
    queryFn: () => productsProvider.getPaginatedProducts({
      limit: 1,
      offset: 1,
      filters: { client: '', localCode: '', internationalCode: '', name: '', transportType: '', dc: '' },
    }),
    enabled: isManager,
  });

  const { data: clients } = useQuery({
    queryKey: ['getPaginatedClients', 1, 0, 'dashboard'],
    queryFn: () => clientsProvider.getPaginatedClients({ limit: 1, offset: 1, filters: { name: '', code: '' } }),
    enabled: isManager,
  });

  const { data: dcs } = useQuery({
    queryKey: ['getPaginatedDcs', 1, 0, 'dashboard'],
    queryFn: () => dcsProvider.getPaginatedDcs({ limit: 1, offset: 1, filters: { name: '', code: '', warehouse: '', client: '' } }),
    enabled: isManager,
  });

  const recentOrders = orders?.data.response ?? [];
  const statusCounts = Object.keys(statusMap).map((key) => {
    const status = Number(key);
    return { status, count: recentOrders.filter((order) => order.status === status).length };
  });
  const drafts = statusCounts.find((item) => item.status === 1)?.count ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of orders and catalog activity."
        actions={
          <CustomFilledButton
            label="New order"
            type="button"
            icon={<BiPlus size={18} />}
            onClick={() => navigate('/my-orders?createOrder=true')}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Orders"
          value={orders?.data.total}
          hint={`${drafts} drafts in the last ${recentOrders.length}`}
          icon={<BiPackage />}
          to="/my-orders"
        />
        {isManager && (
          <>
            <StatCard label="Products" value={products?.data.total} hint="In catalog" icon={<BiBox />} to="/products" />
            <StatCard label="Clients" value={clients?.data.total} hint="Registered" icon={<BsFilePerson />} to="/clients" />
            <StatCard label="Distribution centers" value={dcs?.data.total} hint="Active destinations" icon={<BiMap />} to="/dcs" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="section_title">Order pipeline</h2>
            <span className="text-xs text-neutral-400">Last {recentOrders.length} orders</span>
          </div>

          {recentOrders.length > 0 && (
            <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
              {statusCounts.filter((item) => item.count > 0).map((item) => (
                <div
                  key={item.status}
                  className={`${statusBarColor[item.status]} h-full`}
                  style={{ width: `${(item.count / recentOrders.length) * 100}%` }}
                />
              ))}
            </div>
          )}

          <ul className="mt-5 space-y-4">
            {statusCounts.map((item) => {
              const percent = recentOrders.length ? Math.round((item.count / recentOrders.length) * 100) : 0;
              return (
                <li key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">{statusMap[item.status as keyof typeof statusMap].label}</span>
                    <span className="font-semibold text-ink tabular-nums">
                      {item.count} <span className="font-normal text-neutral-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className={`h-full rounded-full ${statusBarColor[item.status]}`} style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-200/80">
            <h2 className="section_title">Recent orders</h2>
            <Link to="/my-orders" className="inline-flex items-center gap-0.5 text-xs font-medium text-neutral-500 hover:text-ink transition-colors">
              View all <BiChevronRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-neutral-400">
              {orders ? 'No orders yet' : 'Loading...'}
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recentOrders.slice(0, 7).map((order) => (
                <li key={order.id}>
                  <Link
                    to={order.status == 1 ? `/my-orders/addItems/${order.id}` : `/my-orders/${order.id}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50/70 transition-colors"
                  >
                    <div className="size-9 shrink-0 rounded-lg bg-neutral-100 text-neutral-500 grid place-items-center">
                      <BiPackage size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{order.po || `Order #${order.id}`}</p>
                      <p className="text-xs text-neutral-400 truncate">{order.client} · {order.dc}</p>
                    </div>
                    <span className="hidden md:block text-xs text-neutral-500 tabular-nums">W{order.week} · {order.year}</span>
                    <Tag status={order.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

type StatCardProps = {
  label: string;
  value?: number;
  hint: string;
  icon: ReactNode;
  to: string;
};

function StatCard({ label, value, hint, icon, to }: StatCardProps) {
  return (
    <Link to={to} className="card p-5 group hover:border-neutral-300 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{label}</p>
        <div className="size-8 rounded-lg bg-brand-50 text-brand-600 grid place-items-center text-lg group-hover:bg-brand-100 transition-colors">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
        {value ?? <span className="inline-block h-8 w-16 rounded-md bg-neutral-100 animate-pulse align-middle" />}
      </p>
      <p className="mt-1 text-xs text-neutral-400">{hint}</p>
    </Link>
  );
}
