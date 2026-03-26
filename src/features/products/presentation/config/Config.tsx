import { BiPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import { type Column } from "@/features/shared/shared";
import type { Product } from "@/features/products/domain/domain";

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
        header: 'Actions',
        id: 'actions',
        render: (_, row) => (
            <Link to={`/products/update/${row.id}`}>
                <BiPencil size={25} className="hover:text-gray-600" />
            </Link>
        )
    }
];