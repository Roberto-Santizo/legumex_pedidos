import type { Product } from "@/features/products/products"

type Props = {
    product: Product;
}

export function ProductDetailsComponent({ product }: Props) {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 grid grid-cols-2 gap-6">
            <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold">{product.name}</p>
            </div>

            <div>
                <p className="text-gray-500">Client</p>
                <p className="font-semibold">{product.client}</p>
            </div>

            <div>
                <p className="text-gray-500">Local Code</p>
                <p>{product.localCode}</p>
            </div>

            <div>
                <p className="text-gray-500">International Code</p>
                <p>{product.internationalCode}</p>
            </div>

            <div>
                <p className="text-gray-500">Current Price</p>
                <p className="text-green-600 font-bold text-lg">
                    Q {product.price}
                </p>
            </div>

            <div>
                <p className="text-gray-500">Presentation</p>
                <p>{product.presentation}</p>
            </div>

            <div>
                <p className="text-gray-500">Units per Box</p>
                <p>{product.units_per_box}</p>
            </div>

            <div>
                <p className="text-gray-500">Boxes per Pallet</p>
                <p>{product.boxes_per_pallet}</p>
            </div>
            <div>
                <p className="text-gray-500">Transport Type</p>
                <p>{product.transportType}</p>
            </div>
            <div>
                <p className="text-gray-500">DC</p>
                <p>{product.dc}</p>
            </div>
        </div>
    )
}
