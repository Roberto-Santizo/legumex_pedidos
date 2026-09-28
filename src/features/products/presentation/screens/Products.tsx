import { BiPlus, BiUpload } from "react-icons/bi";
import { CustomFilledButton, FilterButton, LoadingState, PageHeader, Pagination } from '@/features/shared/shared';
import { FiltersComponent, productsProvider, productsTableColumns } from "../presentation";
import { Table } from "@/features/shared/shared";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type FiltersProducts, type Product, ModalUpload } from "@/features/products/products";

const initialFilters: FiltersProducts = { client: '', localCode: '', internationalCode: '', name: '', transportType: '', dc: '' };

export function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersProducts>(initialFilters)

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: products } = useQuery({
    queryKey: ['getPaginatedProducts', rowsPerPage, page, filters],
    queryFn: () => productsProvider.getPaginatedProducts({ limit: rowsPerPage, offset: page + 1, filters })
  });

  const { handleSubmit, register, control, reset } = useForm<FiltersProducts>({ defaultValues: { client: '', dc: '', transportType: '' } })

  const onSubmit = (data: FiltersProducts) => {
    setFilters(data);
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    reset();
  }

  if (!products) return <LoadingState />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Catalog of products with pricing per client and DC."
        actions={
          <>
            <FilterButton onClick={() => setOpen(true)} />
            <CustomFilledButton
              label="Upload files"
              type="button"
              variant="secondary"
              onClick={() => navigate('?upload=true')}
              icon={<BiUpload size={18} />}
            />
            <CustomFilledButton
              label="New product"
              type="button"
              onClick={() => navigate('/products/create')}
              icon={<BiPlus size={18} />}
            />
          </>
        }
      />

      <Table<Product>
        columns={productsTableColumns}
        data={products.data.response}
        footer={
          <Pagination
            count={products.data.total}
            setSearchParams={setSearchParams}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        }
      />

      <FiltersComponent
        isOpen={open}
        toggleMenu={setOpen}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={onSubmit}
        control={control}
        clearFilters={clearFilters}
      />

      <ModalUpload />
    </div>
  )
}
