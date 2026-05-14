import { dowloadExcelFile, ReportCard } from "@/features/reports/reports";
import { ordersProvider } from "@/features/my-orders/presentation/providers/ordersRepositoryProvider";
import { useMutation } from "@tanstack/react-query";
import { useNotification, type OrderFiltersReports } from "@/features/shared/shared";
import { useState } from "react";

export function Reports() {
  const notification = useNotification();
  const [filters, setFilters] = useState<OrderFiltersReports>({ year: '', week: '' });

  const { mutate: downloadHeadersReport, isPending: isDownloadingHeaders } = useMutation({
    mutationKey: ['downloadHeadersReport', filters],
    mutationFn: () => ordersProvider.downloadHeadersReport(filters.year, filters.week),
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      dowloadExcelFile(data, 'headers_report');
    }
  });

  const { mutate: dowloadItemsReport, isPending: isDownloadingItems } = useMutation({
    mutationKey: ['downloadItemsReport', filters],
    mutationFn: () => ordersProvider.downloadItemsReport(filters.year, filters.week),
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      dowloadExcelFile(data, 'items_report');
    }
  });

  const { mutate: dowloadOrdersDetails, isPending: isDownloadingOrdersDetails } = useMutation({
    mutationKey: ['downloadOrdersDetailsReport', filters],
    mutationFn: () => ordersProvider.downloadOrderDetailsReport(filters.year, filters.week),
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      const title = `ORDERS DETAILS ${filters.week}-${filters.year}`;
      dowloadExcelFile(data, title);
    }
  });

  const handleDownloadReport = (flag: string) => {
    if (filters.year === '' || filters.week === '') {
      notification.error("Please fill in both year and week");
      return;
    }

    if (flag === '1') {
      downloadHeadersReport();
    } else if (flag == '2') {
      dowloadItemsReport();
    } else {
      dowloadOrdersDetails();
    }
  };

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-slate-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Reports Center
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-3xl border border-gray-200 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Report Filters
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Select the year and week to generate reports
              </p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="year"
                className="text-sm font-medium text-gray-700"
              >
                Year
              </label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder="2026"
                autoComplete="off"
                className="h-12 rounded-xl border border-gray-300 bg-gray-50 px-4 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                onChange={handleOnInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="week"
                className="text-sm font-medium text-gray-700"
              >
                Week
              </label>

              <input
                id="week"
                name="week"
                type="number"
                placeholder="15"
                autoComplete="off"
                className="h-12 rounded-xl border border-gray-300 bg-gray-50 px-4 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                onChange={handleOnInputChange}
              />
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Available Reports
            </h2>

            <p className="text-gray-500 mt-1">
              Generate and download Excel reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ReportCard isLoading={isDownloadingHeaders} onClick={handleDownloadReport} text="1- Order Headers" flag="2" />
            <ReportCard isLoading={isDownloadingItems} onClick={handleDownloadReport} text="2- Order Items" flag="1" />
            <ReportCard isLoading={isDownloadingOrdersDetails} onClick={handleDownloadReport} text="3- Orders Details" flag="3" />
          </div>
        </div>
      </div>
    </div>
  );
}