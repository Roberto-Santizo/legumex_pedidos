
import { colorForOrder } from '../utils/orderColors';
import { MAX_PALLETS } from '../utils/limits';
import type { OrderSummary } from '../../domain/types/types';

interface Props {
    orders: OrderSummary[];
    totalPallets: number;
}

/**
 * Visual 10×2 grid (= 20 cells = MAX_PALLETS) showing which pallets
 * are occupied by each order. Each order gets a distinct color.
 * Empty cells have a dashed border.
 */
export function ContainerVisualization({ orders, totalPallets }: Props) {
    // Build a flat array of 20 cells: each cell holds the color of its occupying order, or null
    const cells: (string | null)[] = Array(MAX_PALLETS).fill(null);

    let cellIndex = 0;
    orders.forEach((order, orderIdx) => {
        const color = colorForOrder(orderIdx);
        const palletsForOrder = Math.round(order.totalPallets);

        for (let i = 0; i < palletsForOrder && cellIndex < MAX_PALLETS; i++) {
            cells[cellIndex] = color;
            cellIndex++;
        }
    });

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Container layout</span>
                <span className="text-xs text-gray-400">{totalPallets} / {MAX_PALLETS} pallets</span>
            </div>

            {/* 10 columns × 2 rows */}
            <div className="grid grid-cols-10 gap-1">
                {cells.map((color, idx) =>
                    color ? (
                        <div
                            key={idx}
                            className="aspect-square rounded-sm"
                            style={{ backgroundColor: color }}
                            title={`Pallet ${idx + 1}`}
                        />
                    ) : (
                        <div
                            key={idx}
                            className="aspect-square rounded-sm border border-dashed border-gray-300"
                            title={`Pallet ${idx + 1} — empty`}
                        />
                    )
                )}
            </div>
        </div>
    );
}
