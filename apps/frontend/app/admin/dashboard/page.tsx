"use client";

import Link from "next/link";
import { useDashboardStats } from "@/lib/dashboard";
import { useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Calendar,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  Award,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  tone?: "default" | "green" | "blue";
}) {
  const toneStyles = {
    default: { bg: "bg-gray-100", text: "text-gray-600", value: "text-gray-900" },
    green: { bg: "bg-green-100", text: "text-green-600", value: "text-green-700" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", value: "text-blue-700" },
  }[tone];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneStyles.bg}`}>
          <Icon size={18} className={toneStyles.text} />
        </div>
      </div>
      <p className={`mt-3 text-2xl md:text-3xl font-bold ${toneStyles.value}`}>
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data?.body) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const stats = data.body;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} />
        <StatCard label="Delivered Orders" value={stats.deliveredOrders} icon={CheckCircle2} />
        <StatCard label="Today's Orders" value={stats.todayOrders} icon={Calendar} />
        <StatCard label="Today's Revenue" value={`₹${stats.todayRevenue}`} icon={IndianRupee} tone="green" />
        <StatCard label="Monthly Orders" value={stats.monthlyOrders} icon={TrendingUp} />
        <StatCard label="Monthly Revenue" value={`₹${stats.monthlyRevenue}`} icon={IndianRupee} tone="blue" />
      </div>

      {/* Total Revenue */}
      <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 p-6">
        <h2 className="mb-1 text-sm font-medium text-gray-500">
          Total Revenue
        </h2>
        <p className="text-3xl md:text-4xl font-bold text-gray-900">
          ₹{stats.totalRevenue}
        </p>
      </div>

      {/* Recent Orders */}
      <SectionCard title="Recent Orders" icon={ShoppingCart}>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="p-2 font-medium">Customer</th>
                <th className="p-2 font-medium">Amount</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                  <td className="p-2 text-gray-900">{order.customerName}</td>
                  <td className="p-2 text-gray-900">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[order.status] ?? "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 md:hidden">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[order.status] ?? "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">₹{order.totalAmount}</p>
              <Link
                href={`/admin/orders/${order.id}`}
                className="mt-3 inline-block text-sm font-medium text-blue-600"
              >
                View Order →
              </Link>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Low Stock Products */}
      <SectionCard title="Low Stock Products" icon={AlertTriangle}>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">All products have sufficient stock.</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="p-2 font-medium">Product</th>
                    <th className="p-2 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                      <td className="p-2 text-gray-900">{product.tamilName}</td>
                      <td className="p-2 font-medium text-red-600">
                        {product.stockQuantityGrams}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="rounded-lg border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-900">{product.tamilName}</h3>
                  <p className="mt-2 font-medium text-red-600">
                    Stock: {product.stockQuantityGrams}g
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>

      {/* Top Selling Products */}
      <SectionCard title="Top Selling Products" icon={Award}>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="p-2 font-medium">Product</th>
                <th className="p-2 font-medium">Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats.topSellingProducts.map((product) => (
                <tr key={product.productId} className="border-b border-gray-50 last:border-0">
                  <td className="p-2 text-gray-900">{product.tamilName}</td>
                  <td className="p-2 font-medium text-green-600">
                    {(product.totalSoldGrams / 1000).toFixed(2)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 md:hidden">
          {stats.topSellingProducts.map((product) => (
            <div key={product.productId} className="rounded-lg border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900">{product.tamilName}</h3>
              <p className="mt-2 font-medium text-green-600">
                Sold: {(product.totalSoldGrams / 1000).toFixed(2)} kg
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
