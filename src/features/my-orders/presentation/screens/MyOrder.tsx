import { OrderDocument } from "../components/OrderDocument";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function MyOrder() {
  const params = useParams();
  const id = params.id!!;

  const { data: order, isLoading } = useQuery({
    queryKey: ['getOrderById', id],
    queryFn: () => ordersProvider.getOrderById(id)
  });

  const { data: products } = useQuery({
    queryKey: ['getOrderProducts', id],
    queryFn: () => ordersProvider.getOrderProducts(id)
  });

  const { data: totals } = useQuery({
    queryKey: ['getOrderTotals', id],
    queryFn: () => ordersProvider.getOrderTotals(id)
  });

  if (isLoading) return <p>Loading...</p>;
  if (!order || !products || !totals) return null;

  return (
    <div className="h-screen flex gap-4 p-4 from-gray-100 to-gray-200">
      <div className="flex-1 bg-white/90 backdrop-blur rounded-2xl shadow-lg border overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <OrderDocument order={order} products={products} totals={totals} />
        </PDFViewer>

      </div>
    </div>
  );
}