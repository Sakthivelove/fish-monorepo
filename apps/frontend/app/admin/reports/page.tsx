"use client";

import { useReports } from "@/lib/reports";

export default function ReportsPage() {
  const {
    data,
    isLoading,
    error,
  } = useReports();

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  if (error || !data?.body) {
    return (
      <div>Failed to load reports</div>
    );
  }

  const report = data.body;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Reports
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Total Orders
          </h3>

          <p className="text-3xl font-bold">
            {report.totalOrders}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Total Revenue
          </h3>

          <p className="text-3xl font-bold">
            ₹{report.totalRevenue}
          </p>
        </div>
      </div>

      {/* Top Products */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Top Selling Products
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                Product
              </th>

              <th className="p-2 text-left">
                Sold
              </th>
            </tr>
          </thead>

          <tbody>
            {report.topProducts.map(
              (product) => (
                <tr
                  key={product.productId}
                  className="border-b"
                >
                  <td className="p-2">
                    {product.tamilName}
                  </td>

                  <td className="p-2">
                    {
                      product.quantitySoldGrams
                    }
                    g
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Status Breakdown */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Orders By Status
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                Status
              </th>

              <th className="p-2 text-left">
                Count
              </th>
            </tr>
          </thead>

          <tbody>
            {report.statusCounts.map(
              (status) => (
                <tr
                  key={status.status}
                  className="border-b"
                >
                  <td className="p-2">
                    {status.status}
                  </td>

                  <td className="p-2">
                    {status.count}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}