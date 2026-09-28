import type { Product } from "@/features/products/products"

type Props = {
    product: Product;
}

export function ProductDetailsComponent({ product }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card p-5 flex flex-col justify-between gap-6">
                <div>
                    <p className="text-xs font-medium text-neutral-500">Current price</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-ink tabular-nums">Q {product.price}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium ring-1 ring-inset ring-brand-200">{product.transportType}</span>
                    <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">{product.client}</span>
                </div>
            </div>

            <div className="card p-5 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                <Info label="Name" value={product.name} />
                <Info label="Client" value={product.client} />
                <Info label="DC" value={product.dc} />
                <Info label="Local code" value={product.localCode} mono />
                <Info label="International code" value={product.internationalCode} mono />
                <Info label="Presentation" value={product.presentation} />
                <Info label="Units per box" value={product.units_per_box} />
                <Info label="Boxes per pallet" value={product.boxes_per_pallet} />
                <Info label="Transport type" value={product.transportType} />
            </div>
        </div>
    )
}

function Info({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className={`mt-0.5 text-sm font-medium text-ink truncate ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</p>
        </div>
    );
}
