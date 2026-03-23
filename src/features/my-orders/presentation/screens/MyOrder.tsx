import { OrderDocument } from "../components/OrderDocument";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export function MyOrder() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['getOrderById', id],
    queryFn: () => ordersProvider.getOrderById(id!)
  });

  const { data: products } = useQuery({
    queryKey: ['getOrderProducts', id],
    queryFn: () => ordersProvider.getOrderProducts(id!)
  });

  const { data: totals } = useQuery({
    queryKey: ['getOrderTotals', id],
    queryFn: () => ordersProvider.getOrderTotals(id!)
  });


  if (isLoading) return <p>Loading...</p>
  if (order && products && totals) return (
    <div style={{ height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <OrderDocument
          order={order}
          products={products}
          totals={totals}
        />
      </PDFViewer>
    </div>
  );
}