import { BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { type Column } from "@/features/shared/shared";
import type { Product, ProductPrice } from "@/features/products/domain/domain";

export const productsTableColumns: Column<Product>[] = [
    { header: 'Id', accessor: 'id', id: 'id' },
    { header: 'Name', accessor: 'name', id: 'name' },
    { header: 'Local Code', accessor: 'localCode', id: 'localCode' },
    { header: 'International Code', accessor: 'internationalCode', id: 'internationalCode' },
    { header: 'Client', accessor: 'client', id: 'client' },
    { header: 'Presentation', accessor: 'presentation', id: 'presentation' },
    { header: 'Boxes Per Pallet', accessor: 'boxes_per_pallet', id: 'boxesPerPallet' },
    { header: 'Price', accessor: 'price', id: 'price' },
    {
        header: 'Edit',
        id: 'action_edit',
        render: (_, row) => (
            <Link to={`/products/update/${row.id}`}>
                <BiPencil size={25} className="hover:text-gray-600" />
            </Link>
        )
    },
    {
        header: 'Details',
        id: 'action_view',
        render: (_, row) => (
            <Link to={`/products/${row.id}`}>
                <BsEye size={25} className="hover:text-gray-600" />
            </Link>
        )
    }
];

export const productPricesTableColumns: Column<ProductPrice>[] = [
    { header: 'Id', accessor: 'id', id: 'id' },
    { header: 'Precio Anterior', accessor: 'last_price', id: 'lastPrice' },
    { header: 'Precio Actual', accessor: 'new_price', id: 'newPrice' },
];