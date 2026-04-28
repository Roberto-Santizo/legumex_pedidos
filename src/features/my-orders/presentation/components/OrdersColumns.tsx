import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Tag, type Column } from "@/features/shared/shared";
import type { Order } from "@/features/my-orders/my-orders";

export const ordersColumns: Column<Order>[] = [
  { header: 'Created By', accessor: 'user', id: 'user' },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Transaport Type', accessor: 'transportType', id: 'transportType' },
  { header: 'DC', accessor: 'dc', id: 'dc' },
  { header: 'PO', accessor: 'po', id: 'po' },
  { header: 'Required By', accessor: 'requiredByDate', id: 'requiredByDate' },
  { header: 'Year', accessor: 'year', id: 'year' },
  { header: 'Week', accessor: 'week', id: 'week' },
  {
    header: 'status',
    id: 'status',
    render: (_, row) => <Tag status={row.status} />,
  },
  {
    header: 'Actions',
    id: 'actions',
    render: (_, row) => {
      const url = row.status == 1
        ? `/my-orders/addItems/${row.id}`
        : `/my-orders/${row.id}`;

      return (
        <Link to={url}>
          <BsEye size={25} className="hover:text-gray-600" />
        </Link>
      );
    },
  },
];