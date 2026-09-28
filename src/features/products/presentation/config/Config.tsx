import { BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { type Column } from "@/features/shared/shared";
import type { Product, ProductPrice } from "@/features/products/domain/domain";

export const productsTableColumns: Column<Product>[] = [
    { header: 'Name', accessor: 'name', id: 'name', render: (value) => <span className="font-medium text-ink">{value}</span> },
    { header: 'Local Code', accessor: 'localCode', id: 'localCode', render: (value) => <span className="font-mono text-xs">{value}</span> },
    { header: 'International Code', accessor: 'internationalCode', id: 'internationalCode', render: (value) => <span className="font-mono text-xs">{value}</span> },
    { header: 'Client', accessor: 'client', id: 'client' },
    { header: 'Price', accessor: 'price', id: 'price', render: (value) => <span className="font-medium tabular-nums text-ink">{value}</span> },
    { header: 'DC', accessor: 'dc', id: 'dc' },
    {
        header: 'Transport Type',
        accessor: 'transportType',
        id: 'transportType',
        render: (value) => (
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">{value}</span>
        )
    },
    {
        header: 'Actions',
        id: 'actions',
        render: (_, row) => (
            <div className="flex items-center gap-1">
                <Link to={`/products/${row.id}`} className="icon_btn" title="Details">
                    <BsEye size={16} />
                </Link>
                <Link to={`/products/update/${row.id}`} className="icon_btn" title="Edit">
                    <BiPencil size={17} />
                </Link>
            </div>
        )
    }
];

export const productPricesTableColumns: Column<ProductPrice>[] = [
    { header: 'Id', accessor: 'id', id: 'id' },
    { header: 'Precio Anterior', accessor: 'last_price', id: 'lastPrice' },
    { header: 'Precio Actual', accessor: 'new_price', id: 'newPrice' },
];