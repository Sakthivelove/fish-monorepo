"use client";

import Link from "next/link";
import { useDashboardStats } from "@/lib/dashboard";
import { useEffect } from "react";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
  } = useDashboardStats();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading) {
    return (
      <div>Loading dashboard...</div>
    );
  }

  if (error || !data?.body) {
    return (
      <div>
        Failed to load dashboard
      </div>
    );
  }

  const stats = data.body;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Total Products
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.totalProducts}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Total Orders
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.totalOrders}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Pending Orders
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Delivered Orders
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Today's Orders
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.todayOrders}
          </p>
        </div>

        <div className="border rounded p-4 bg-green-50">
          <h3 className="text-sm text-gray-500">
            Today's Revenue
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-green-600">
            ₹{stats.todayRevenue}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3 className="text-sm text-gray-500">
            Monthly Orders
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {stats.monthlyOrders}
          </p>
        </div>

        <div className="border rounded p-4 bg-blue-50">
          <h3 className="text-sm text-gray-500">
            Monthly Revenue
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            ₹{stats.monthlyRevenue}
          </p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="border rounded p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-semibold mb-2">
          Total Revenue
        </h2>

        <p className="text-4xl font-bold">
          ₹{stats.totalRevenue}
        </p>
      </div>

      {/* Recent Orders */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">
                  Customer
                </th>

                <th className="p-2 text-left">
                  Amount
                </th>

                <th className="p-2 text-left">
                  Status
                </th>

                <th className="p-2 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-b"
                  >
                    <td className="p-2">
                      {
                        order.customerName
                      }
                    </td>

                    <td className="p-2">
                      ₹
                      {
                        order.totalAmount
                      }
                    </td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium
    ${order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/*Mobile View */}
        <div className="md:hidden space-y-3">
          {stats.recentOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-semibold">
                {order.customerName}
              </h3>

              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">
                    Amount:
                  </span>{" "}
                  ₹{order.totalAmount}
                </p>

                <p>
                  <span className="font-medium">
                    Status:
                  </span>{" "}
                  {order.status}
                </p>
              </div>

              <Link
                href={`/admin/orders/${order.id}`}
                className="mt-3 inline-block border px-3 py-2 rounded text-blue-600"
              >
                View Order
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Low Stock Products
        </h2>

        {stats.lowStockProducts
          .length === 0 ? (
          <p>
            All products have
            sufficient stock.
          </p>
        ) : (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">
                      Product
                    </th>

                    <th className="p-2 text-left">
                      Stock
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stats.lowStockProducts.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-b"
                      >
                        <td className="p-2">
                          {
                            product.tamilName
                          }
                        </td>

                        <td className="p-2">
                          {
                            product.stockQuantityGrams
                          }
                          g
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-semibold">
                    {product.tamilName}
                  </h3>

                  <p className="mt-2 text-red-600 font-medium">
                    Stock: {product.stockQuantityGrams}g
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Top Selling Products
        </h2>

        <div className="hidden md:block overflow-x-auto">
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
              {stats.topSellingProducts.map(
                (product) => (
                  <tr
                    key={product.productId}
                    className="border-b"
                  >
                    <td className="p-2">
                      {product.tamilName}
                    </td>

                    <td className="p-2">
                      {(
                        product.totalSoldGrams /
                        1000
                      ).toFixed(2)}
                      kg
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {stats.topSellingProducts.map((product) => (
            <div
              key={product.productId}
              className="border rounded-lg p-4"
            >
              <h3 className="font-semibold">
                {product.tamilName}
              </h3>

              <p className="mt-2 text-green-600 font-medium">
                Sold: {(product.totalSoldGrams / 1000).toFixed(2)} kg
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}