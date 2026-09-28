import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { productPricesTableColumns, productsProvider } from "../presentation";
import { LoadingState, PageHeader, Table } from "@/features/shared/shared";
import { ProductDetailsComponent } from "@/features/products/products";

export function ProductDetails() {
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ["getProductById", id],
    queryFn: () => productsProvider.getProductById(id!),
    enabled: !!id,
  });

  if (!product) return <LoadingState />;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader title={product.name} description="Product information and price history." backTo="/products" />
      <ProductDetailsComponent product={product} />

      <div className="space-y-3">
        <h2 className="section_title">Price history</h2>

        <Table
          columns={productPricesTableColumns}
          data={product.prices ?? []}
          emptyMessage="No price history available"
        />
      </div>
    </div>
  );
}
