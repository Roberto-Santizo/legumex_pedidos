import type { Column } from "@/features/shared/domain/domain";

type Props<T> = {
    columns: Column<T>[];
    data: T[];
};

export function Table<T>({ columns, data }: Props<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={col.accessor ? String(col.accessor) : index}
                                className="text-left px-6 py-3 text-sm font-semibold text-gray-600"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                            {columns.map((col) => {
                                const value = col.accessor ? row[col.accessor] : undefined;
                                return (
                                    <td
                                        key={String(col.id)}
                                        className="px-6 py-4 text-sm text-gray-700"
                                    >
                                        {col.render ? col.render(value, row) : String(value)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}