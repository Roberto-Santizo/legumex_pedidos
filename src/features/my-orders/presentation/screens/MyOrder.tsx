import { OrderDocument } from "../components/OrderDocument";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { LoadingState, PageHeader, Tag } from "@/features/shared/shared";

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

  if (isLoading || !order || !products || !totals) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.po ? `Order ${order.po}` : 'Order'}
        description={`${order.client} · ${order.dc}`}
        backTo="/my-orders"
        actions={<Tag status={order.status} />}
      />

      <div className="card overflow-hidden h-[calc(100vh-13rem)] min-h-[500px]">
        <PDFViewer width="100%" height="100%" className="border-0">
          <OrderDocument order={order} products={products} totals={totals} />
        </PDFViewer>
      </div>
    </div>
  );
}