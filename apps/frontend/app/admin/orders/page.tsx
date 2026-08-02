"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrders } from "@/lib/orders";
import { useRef } from "react";
import {
    showOrderNotification,
    playOrderSound,
} from "@/lib/notifications";
import { Search, Bell } from "lucide-react";

type Order = {
    id: string;
    customerName: string;
    phone: string;
    totalAmount: number;
    status:
    | "PENDING"
    | "CONFIRMED"
    | "CUTTING"
    | "PACKING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
    createdAt: string;
};

const STATUS_STYLES: Record<Order["status"], string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    CUTTING: "bg-purple-100 text-purple-700",
    PACKING: "bg-indigo-100 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: Order["status"] }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
            {status}
        </span>
    );
}

export default function OrdersPage() {
    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const {
        data,
        isLoading,
        refetch,
    } = useOrders(
        search,
        status as any
    );

    const orders =
        data?.body ?? [];

    const pendingCount =
        orders.filter(
            (order) =>
                order.status === "PENDING"
        ).length;

    const previousPendingRef =
        useRef(0);

    const previousOrderIds =
        useRef<string[]>([]);

    useEffect(() => {
        const currentPending =
            orders.filter(
                (o) =>
                    o.status === "PENDING"
            ).length;

        if (
            previousPendingRef.current > 0 &&
            currentPending >
            previousPendingRef.current
        ) {
            playOrderSound();
        }

        previousPendingRef.current =
            currentPending;
    }, [orders]);

    useEffect(() => {
        const currentIds =
            orders.map(
                (order) => order.id
            );

        const newOrders =
            currentIds.filter(
                (id) =>
                    !previousOrderIds.current.includes(
                        id
                    )
            );

        if (
            previousOrderIds.current.length >
            0 &&
            newOrders.length > 0
        ) {
            showOrderNotification(
                "புதிய ஆர்டர்",
                `${newOrders.length} புதிய ஆர்டர் வந்துள்ளது`
            );

            playOrderSound();
        }

        previousOrderIds.current =
            currentIds;
    }, [orders]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center text-gray-400">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Orders
                </h1>

                {pendingCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        <Bell size={12} />
                        {pendingCount} New
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative w-full">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 md:w-56"
                >
                    <option value="">All Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CUTTING">CUTTING</option>
                    <option value="PACKING">PACKING</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                                <th className="p-3 font-medium">Order ID</th>
                                <th className="p-3 font-medium">Customer</th>
                                <th className="p-3 font-medium">Phone</th>
                                <th className="p-3 font-medium">Amount</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Date</th>
                                <th className="p-3 font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                                >
                                    <td className="p-3 font-mono text-xs text-gray-500">
                                        {order.id.slice(0, 8)}
                                    </td>
                                    <td className="p-3 font-medium text-gray-900">
                                        {order.customerName}
                                    </td>
                                    <td className="p-3 text-gray-600">{order.phone}</td>
                                    <td className="p-3 text-gray-900">₹{order.totalAmount}</td>
                                    <td className="p-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold text-gray-900">
                                #{order.id.slice(0, 8)}
                            </span>
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-700">Customer:</span>{" "}
                                {order.customerName}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Phone:</span>{" "}
                                {order.phone}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Amount:</span>{" "}
                                ₹{order.totalAmount}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Date:</span>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <Link
                            href={`/admin/orders/${order.id}`}
                            className="mt-3 inline-block text-sm font-medium text-blue-600"
                        >
                            View Details →
                        </Link>
                    </div>
                ))}

                {orders.length === 0 && (
                    <p className="p-6 text-center text-gray-400">No orders found</p>
                )}
            </div>
        </div>
    );
}
