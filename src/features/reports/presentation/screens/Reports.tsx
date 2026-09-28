import { dowloadExcelFile, ReportCard } from "@/features/reports/reports";
import { ordersProvider } from "@/features/my-orders/presentation/providers/ordersRepositoryProvider";
import { useMutation } from "@tanstack/react-query";
import { PageHeader, useNotification, type OrderFiltersReports } from "@/features/shared/shared";
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
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and download Excel reports by week." />

      <div className="card p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 w-40">
            <label htmlFor="year" className="form_label">Year</label>
            <input
              id="year"
              name="year"
              type="number"
              placeholder="2026"
              autoComplete="off"
              className="text_form_field"
              onChange={handleOnInputChange}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-40">
            <label htmlFor="week" className="form_label">Week</label>
            <input
              id="week"
              name="week"
              type="number"
              placeholder="15"
              autoComplete="off"
              className="text_form_field"
              onChange={handleOnInputChange}
            />
          </div>

          <p className="muted pb-2.5">Select the year and week, then download any report below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ReportCard isLoading={isDownloadingHeaders} onClick={handleDownloadReport} text="Order headers" description="One row per order with client, DC, PO and dates." flag="1" />
        <ReportCard isLoading={isDownloadingItems} onClick={handleDownloadReport} text="Order items" description="Every product line across the week's orders." flag="2" />
        <ReportCard isLoading={isDownloadingOrdersDetails} onClick={handleDownloadReport} text="Orders details" description="Detailed breakdown of orders with totals." flag="3" />
      </div>
    </div>
  );
}