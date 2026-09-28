import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Tag, type Column } from "@/features/shared/shared";
import { DeleteButton, EditButton, type Order } from "@/features/my-orders/my-orders";

export const ordersColumns: Column<Order>[] = [
  { header: 'PO', accessor: 'po', id: 'po', render: (value) => <span className="font-medium text-ink">{value}</span> },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'DC', accessor: 'dc', id: 'dc' },
  { header: 'Transport Type', accessor: 'transportType', id: 'transportType' },
  { header: 'Required By', accessor: 'requiredByDate', id: 'requiredByDate', render: (value) => <span className="tabular-nums">{value}</span> },
  {
    header: 'Week',
    id: 'week',
    render: (_, row) => <span className="tabular-nums text-neutral-500">W{row.week} · {row.year}</span>,
  },
  { header: 'Created By', accessor: 'user', id: 'user', render: (value) => <span className="text-neutral-500">{value}</span> },
  {
    header: 'Status',
    id: 'status',
    render: (_, row) => <Tag status={row.status} />,
  },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => {
      const url = row.status == 1 ? `/my-orders/addItems/${row.id}` : `/my-orders/${row.id}`;

      return (
        <div className="flex items-center gap-1">
          <Link to={url} className="icon_btn" title="Details">
            <BsEye size={16} />
          </Link>
          {row.status < 2 && (
            <>
              <EditButton id={row.id} />
              <DeleteButton id={row.id} />
            </>
          )}
        </div>
      );
    },
  },
];
