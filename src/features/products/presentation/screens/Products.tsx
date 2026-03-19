import { BiPlus } from "react-icons/bi";
import { CustomFilledButton } from '@/features/shared/shared';
import { Table, type Column } from "@/features/shared/shared";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/features/products/domain/domain";

const columns: Column<Product>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Local Code', accessor: 'localCode' },
  { header: 'International Code', accessor: 'internationalCode' },
  { header: 'Presentation', accessor: 'presetation' },
  { header: 'Price', accessor: 'price' },
];

export function Products() {
  const navigate = useNavigate();

  const products: Product[] = [];
  return (
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
