import { BiMenu, BiPlus } from "react-icons/bi";
import { CustomFilledButton, Pagination } from '@/features/shared/shared';
import { FiltersComponent, productsProvider, productsTableColumns } from "../presentation";
import { Table } from "@/features/shared/shared";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { FiltersProducts, Product } from "@/features/products/products";

export function Products() {
  const navigate = useNavigate();
  const initialFilters: FiltersProducts = { client: '', localCode: '', internationalCode: '', name: '', transportType: '', dc: '' };
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersProducts>(initialFilters)

  const page = Number(searchParams.get("page")) || 0;
  const rowsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: products } = useQuery({
    queryKey: ['getPaginatedProducts', rowsPerPage, page, filters],
    queryFn: () => productsProvider.getPaginatedProducts({ limit: rowsPerPage, offset: page + 1, filters })
  });

  const { handleSubmit, register, control, reset } = useForm<FiltersProducts>({ defaultValues: { client: '' } })

  const onSubmit = (data: FiltersProducts) => {
    setFilters(data);
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    reset();
  }

  if (products) return (
    <div className="space-y-5">
      <h1 className="main_title">Products</h1>

      <div className="flex w-full items-end flex-col gap-5">
        <BiMenu size={40} onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-500" />
        <CustomFilledButton
          label="Create Code"
          type="button"
          onClick={() => navigate('/products/create')}
          icon={<BiPlus className="text-white" />}
        />
      </div>

      <Table<Product>
        columns={productsTableColumns}
        data={products.data.response}
      />

      <Pagination
        count={products.data.total}
        setSearchParams={setSearchParams}
        page={page}
        rowsPerPage={rowsPerPage}
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
    </div>
  )
}
