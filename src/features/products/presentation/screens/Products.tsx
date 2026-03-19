import { BiPencil, BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { Link, useNavigate } from "react-router-dom";
import { productsProvider } from "../presentation";
import { Table, type Column } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/features/products/domain/domain";

const columns: Column<Product>[] = [
  { header: 'id', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Local Code', accessor: 'localCode' },
  { header: 'International Code', accessor: 'internationalCode' },
  { header: 'Presentation', accessor: 'presentation' },
  { header: 'Price', accessor: 'price' },
  {
    header: 'Actions',
    render: (_, row) => (
      <Link to={`/products/update/${row.id}`}>
        <BiPencil size={25} className="hover:text-gray-600" />
      </Link>
    ),
  },
];

export function Products() {
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => productsProvider.getProducts()
  });

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (products) return (
    <div className="space-y-5">
      <h1 className="main_title">Products</h1>

      <div className="flex w-full justify-end">
        <CustomFilledButton
          label="Create Code"
          type="button"
          onClick={() => navigate('/products/create')}
          icon={<BiPlus className="text-white" />}
        />
      </div>

      <Table<Product>
        columns={columns}
        data={products}
      />
    </div>
  )
}
