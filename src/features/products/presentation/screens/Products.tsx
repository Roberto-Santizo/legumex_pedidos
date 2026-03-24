import { BiPencil, BiPlus } from "react-icons/bi";
import { CustomFilledButton, Pagination } from '@/features/shared/shared';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { productsProvider } from "../presentation";
import { Table, type Column } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/features/products/domain/domain";

const columns: Column<Product>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
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
    ),
  },
];

export function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;


  const { data: products, isLoading } = useQuery({
    queryKey: ['getProducts', rowsPerPage, page],
    queryFn: () => productsProvider.getPaginatedProducts({ limit: rowsPerPage, offset: page + 1 })
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setSearchParams((params) => {
      params.set('page', newPage.toString());
      return params;
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newLimit = parseInt(event.target.value, 10);

    setSearchParams((params) => {
      params.set('limit', newLimit.toString());
      params.set('page', '0');
      return params;
    });
  };

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
        data={products.data.response}
      />

      <Pagination
        count={products.data.total}
        handleOnPageChange={handleChangePage}
        handleOnRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </div>
  )
}
