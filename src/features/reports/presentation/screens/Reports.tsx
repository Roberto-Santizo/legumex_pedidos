import { CustomFilledButton, useNotification, type OrderFiltersReports } from "@/features/shared/shared";
import { dowloadExcelFile } from "@/features/reports/reports";
import { isPending } from "@reduxjs/toolkit";
import { ordersProvider } from "@/features/my-orders/presentation/providers/ordersRepositoryProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function Reports() {
  const notification = useNotification();

  const [filters, setFilters] = useState<OrderFiltersReports>({ startDate: '', endDate: '' });


  const { mutate: downloadHeadersReport } = useMutation({
    mutationKey: ['downloadHeadersReport', filters],
    mutationFn: () => ordersProvider.downloadHeadersReport(filters.startDate, filters.endDate),
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      dowloadExcelFile(data, 'headers_report');
    }
  });

  const { mutate: dowloadItemsReport } = useMutation({
    mutationKey: ['downloadItemsReport', filters],
    mutationFn: () => ordersProvider.downloadItemsReport(filters.startDate, filters.endDate),
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      dowloadExcelFile(data, 'items_report');
    }
  });

  const handleDownloadHeadersReport = (flag: string) => {
    if (filters.startDate == '' || filters.endDate == '') {
      notification.error("Please fill in both start and end dates");
      return;
    }
    if (flag === '1') {
      downloadHeadersReport();
    } else {
      dowloadItemsReport();
    }
  }

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      </div>

      <form
        className="bg-white rounded-2xl shadow-sm border p-6 grid grid-cols-1 gap-6"
      >
        <div className="flex flex-col gap-2 w-full">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor={"startDate"}
          >
            Start Date
          </label>

          <input
            type="date"
            id="startDate"
            name="startDate"
            className={`text_form_field`}
            onChange={handleOnInputChange}
          />
        </div>


        <div className="flex flex-col gap-2 w-full">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor={"endDate"}
          >
            End Date
          </label>

          <input
            type="date"
            id="endDate"
            name="endDate"
            className={`text_form_field`}
            onChange={handleOnInputChange}
          />
        </div>

      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Available Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Orders Items
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Orders Items details
              </p>
            </div>

            <div className="mt-4">
              <CustomFilledButton
                disabled={!isPending}
                label="Download"
                type="button"
                className={"w-full"}
                onClick={() => handleDownloadHeadersReport('2')}
              />
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Headers
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Orders Headers
              </p>
            </div>

            <div className="mt-4">
              <CustomFilledButton
                disabled={!isPending}
                label="Download"
                type="button"
                className="w-full"
                onClick={() => handleDownloadHeadersReport('1')}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}