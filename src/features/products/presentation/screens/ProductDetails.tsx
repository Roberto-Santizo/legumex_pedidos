import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { productPricesTableColumns, productsProvider } from "../presentation";
import { Table } from "@/features/shared/shared";
import { ProductDetailsComponent } from "../components/ProductDetailsComponent";

export function ProductDetails() {
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ["getProductById", id],
    queryFn: () => productsProvider.getProductById(id!),
    enabled: !!id,
  });

  if (product) return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="main_title mb-6">Detalle del Producto</h1>
      <ProductDetailsComponent product={product} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Historial de precios</h2>

        {product.prices?.length === 0 ? (
          <p className="text-gray-500">No hay historial de precios</p>
        ) : (
          <div className="bg-white p-5 shadow-2xl">
            <Table
              columns={productPricesTableColumns}
              data={product.prices ?? []}
            />
          </div>
        )}
      </div>
    </div>
  );
}