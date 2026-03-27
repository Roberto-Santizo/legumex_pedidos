import type { Product } from "@/features/products/products"

type Props = {
    product: Product;
}

export function ProductDetailsComponent({ product }: Props) {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 grid grid-cols-2 gap-6">
            <div>
                <p className="text-gray-500">Nombre</p>
                <p className="font-semibold">{product.name}</p>
            </div>

            <div>
                <p className="text-gray-500">Cliente</p>
                <p className="font-semibold">{product.client}</p>
            </div>

            <div>
                <p className="text-gray-500">Código Local</p>
                <p>{product.localCode}</p>
            </div>

            <div>
                <p className="text-gray-500">Código Internacional</p>
                <p>{product.internationalCode}</p>
            </div>

            <div>
                <p className="text-gray-500">Precio Actual</p>
                <p className="text-green-600 font-bold text-lg">
                    Q {product.price}
                </p>
            </div>

            <div>
                <p className="text-gray-500">Presentación</p>
                <p>{product.presentation}</p>
            </div>

            <div>
                <p className="text-gray-500">Unidades por caja</p>
                <p>{product.units_per_box}</p>
            </div>

            <div>
                <p className="text-gray-500">Cajas por pallet</p>
                <p>{product.boxes_per_pallet}</p>
            </div>
        </div>
    )
}
