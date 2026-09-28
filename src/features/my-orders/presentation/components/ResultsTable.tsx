import { handleExportExcel, type UploadFileResponse } from "@/features/my-orders/my-orders"
import { CustomFilledButton } from "@/features/shared/components/components"
import { BiDownload } from "react-icons/bi"

type Props = {
    data: UploadFileResponse
}

export function ResultsTable({ data }: Props) {
    const { total, success, failed, results } = data.data

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-neutral-200/80 p-4">
                    <p className="text-xs font-medium text-neutral-500">Total</p>
                    <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{total}</p>
                </div>

                <div className="rounded-xl bg-brand-50 ring-1 ring-inset ring-brand-200 p-4">
                    <p className="text-xs font-medium text-brand-700">Success</p>
                    <p className="mt-1 text-xl font-semibold text-brand-800 tabular-nums">{success}</p>
                </div>

                <div className="rounded-xl bg-red-50 ring-1 ring-inset ring-red-200 p-4">
                    <p className="text-xs font-medium text-red-600">Failed</p>
                    <p className="mt-1 text-xl font-semibold text-red-700 tabular-nums">{failed}</p>
                </div>
            </div>

            <div className="flex justify-end">
                <CustomFilledButton
                    label="Download xlsx"
                    type="button"
                    variant="secondary"
                    icon={<BiDownload size={18} />}
                    onClick={() => handleExportExcel(data.data.results)}
                />
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200/80">
                <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50/70 border-b border-neutral-200/80">
                        <tr>
                            <th className="text-left px-5 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left px-5 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                                Message
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {results.map((result, index) => (
                            <tr
                                key={index}
                                className="hover:bg-neutral-50/70 transition-colors"
                            >
                                <td className="px-5 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium ring-1 ring-inset ${result.success
                                            ? "bg-brand-50 text-brand-700 ring-brand-200"
                                            : "bg-red-50 text-red-700 ring-red-200"
                                            }`}
                                    >
                                        <span className={`size-1.5 rounded-full ${result.success ? 'bg-brand-500' : 'bg-red-500'}`} />
                                        {result.success ? "Success" : "Error"}
                                    </span>
                                </td>

                                <td className="px-5 py-3 text-neutral-700">
                                    {result.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
