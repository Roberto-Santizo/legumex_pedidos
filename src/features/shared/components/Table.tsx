import type { ReactNode } from "react";
import type { Column } from "@/features/shared/domain/domain";
import { BiSearchAlt } from "react-icons/bi";

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    footer?: ReactNode;
    emptyMessage?: string;
};

export function Table<T>({ columns, data, footer, emptyMessage = 'No records found' }: Props<T>) {
    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto thin_scroll">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                            {columns.map((col, index) => (
                                <th
                                    key={col.accessor ? String(col.accessor) : index}
                                    className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-5 py-14">
                                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                                        <div className="size-10 rounded-full bg-neutral-100 grid place-items-center">
                                            <BiSearchAlt size={20} />
                                        </div>
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-50/70 transition-colors">
                                {columns.map((col) => {
                                    const value = col.accessor ? row[col.accessor] : undefined;
                                    return (
                                        <td
                                            key={String(col.id)}
                                            className="px-5 py-3.5 text-neutral-700 whitespace-nowrap"
                                        >
                                            {col.render ? col.render(value, row) : String(value ?? '—')}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {footer && (
                <div className="border-t border-neutral-200/80">
                    {footer}
                </div>
            )}
        </div>
    );
}
