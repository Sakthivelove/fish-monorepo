"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrders } from "@/lib/orders";
import { useRef } from "react";
import {
    showOrderNotification,
    playOrderSound,
} from "@/lib/notifications";

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
            <div>
                Loading orders...
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold">
                    Orders
                </h1>

                {pendingCount > 0 && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                        {pendingCount} New
                    </span>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="border p-2 rounded w-full"
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                    className="border p-2 rounded w-full md:w-auto"
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="PENDING">
                        PENDING
                    </option>

                    <option value="CONFIRMED">
                        CONFIRMED
                    </option>

                    <option value="CUTTING">
                        CUTTING
                    </option>

                    <option value="PACKING">
                        PACKING
                    </option>

                    <option value="OUT_FOR_DELIVERY">
                        OUT_FOR_DELIVERY
                    </option>

                    <option value="DELIVERED">
                        DELIVERED
                    </option>

                    <option value="CANCELLED">
                        CANCELLED
                    </option>
                </select>
            </div>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">
                                Order ID
                            </th>

                            <th className="p-3 text-left">
                                Customer
                            </th>

                            <th className="p-3 text-left">
                                Phone
                            </th>

                            <th className="p-3 text-left">
                                Amount
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Date
                            </th>
                            <th className="p-3 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b"
                            >
                                <td className="p-3">
                                    {order.id.slice(0, 8)}
                                </td>

                                <td className="p-3">
                                    {order.customerName}
                                </td>

                                <td className="p-3">
                                    {order.phone}
                                </td>

                                <td className="p-3">
                                    ₹{order.totalAmount}
                                </td>

                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-white text-sm
    ${order.status === "PENDING"
                                                ? "bg-yellow-500"
                                                : order.status === "CONFIRMED"
                                                    ? "bg-blue-500"
                                                    : order.status === "CUTTING"
                                                        ? "bg-purple-500"
                                                        : order.status === "PACKING"
                                                            ? "bg-indigo-500"
                                                            : order.status ===
                                                                "OUT_FOR_DELIVERY"
                                                                ? "bg-orange-500"
                                                                : order.status ===
                                                                    "DELIVERED"
                                                                    ? "bg-green-600"
                                                                    : "bg-red-600"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-blue-600"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4 shadow-sm"
                    >
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                #{order.id.slice(0, 8)}
                            </span>

                            <span
                                className={`px-2 py-1 rounded text-white text-xs
            ${order.status === "PENDING"
                                        ? "bg-yellow-500"
                                        : order.status === "CONFIRMED"
                                            ? "bg-blue-500"
                                            : order.status === "CUTTING"
                                                ? "bg-purple-500"
                                                : order.status === "PACKING"
                                                    ? "bg-indigo-500"
                                                    : order.status === "OUT_FOR_DELIVERY"
                                                        ? "bg-orange-500"
                                                        : order.status === "DELIVERED"
                                                            ? "bg-green-600"
                                                            : "bg-red-600"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-2">

                            <p className="mt-2">
                                <strong>Customer:</strong> {order.customerName}
                            </p>

                            <p>
                                <strong>Phone:</strong> {order.phone}
                            </p>

                            <p>
                                <strong>Amount:</strong> ₹{order.totalAmount}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <Link
                                href={`/admin/orders/${order.id}`}
                                className="inline-block mt-3 text-blue-600 font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* <button
                onClick={() =>
                    showOrderNotification(
                        "Test",
                        "Notification Working"
                    )
                }
            >
                Test Notification
            </button>

            <button
                onClick={() => {
                    new Notification(
                        "Direct Test",
                        {
                            body: "Direct Browser Test",
                        }
                    );
                }}
            >
                Direct Notification
            </button> */}
        </div>
    );
}