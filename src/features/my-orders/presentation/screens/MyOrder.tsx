import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { Tag } from "@/features/shared/shared";

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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order # {order.id}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-semibold text-gray-800">{order.customer}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Status</p>
          <span className="inline-block px-3 py-1 text-sm rounded-full">
            <Tag status={order.status}/>
          </span>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Total Boxes</p>
          <p className="font-semibold text-gray-800">{totals.total_boxes}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Total Pounds</p>
          <p className="font-semibold text-gray-800">{totals.total_lbs}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-semibold text-gray-800">{totals.total_price}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Code</th>
              <th className="text-center p-3">Boxes</th>
              <th className="text-center p-3">Total Pounds</th>
              <th className="text-center p-3">PO</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.product}</td>
                <td className="p-3 text-center">{product.internationalCode}</td>
                <td className="p-3 text-center">{product.total_boxes}</td>
                <td className="p-3 text-center">{product.total_lbs}</td>
                <td className="p-3 text-center">{product.po}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}