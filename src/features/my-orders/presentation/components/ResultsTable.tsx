import { handleExportExcel, type UploadFileResponse } from "@/features/my-orders/my-orders"
import { CustomFilledButton } from "@/features/shared/components/components"

type Props = {
    data: UploadFileResponse
}

export function ResultsTable({ data }: Props) {
    const { total, success, failed, results } = data.data

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-800">{total}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-green-600">Success</p>
                    <p className="text-xl font-semibold text-green-700">{success}</p>
                </div>

                <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-600">Failed</p>
                    <p className="text-xl font-semibold text-red-700">{failed}</p>
                </div>

                <div className="bg-red-50 rounded-xl p-4 text-center">
                    <CustomFilledButton
                        label="Download Xlsx"
                        type="button"
                        onClick={() => handleExportExcel(data.data.results)}
                    />
                </div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Message
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {results.map((result, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${result.success
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {result.success ? "Success" : "Error"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-700">
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