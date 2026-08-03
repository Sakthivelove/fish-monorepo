"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCancelOrder, useOrder, useUpdateOrderStatus } from "@/lib/orders";



type Order = {
    id: string;
    customerName: string;
    phone: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: {
        id: number;
        quantityGrams: number;
        subtotal: number;
        cuttingOption: string;
        product: {
            id: string;
            name: string;
            tamilName: string;
        };
    }[];
};

export default function OrderDetailsPage() {
    const params = useParams();

    const id = params.id as string;

    const { data, isLoading, refetch } =
        useOrder(id);

    const updateOrderStatus =
        useUpdateOrderStatus();
    const cancelOrder =
        useCancelOrder();

    const handleCancelOrder = async () => {
        try {
            await cancelOrder.mutateAsync({
                params: {
                    id,
                },
                body: {
                    cancelledBy: "ADMIN",
                    reason: cancelReason,
                },
            });

            setShowCancelModal(false);

            await refetch();

            alert("Order Cancelled");
        } catch (err) {
            console.error(err);

            alert("Failed");
        }
    };

    const order =
        data?.body;

    const [status, setStatus] =
        useState("");

    const [showCancelModal, setShowCancelModal] =
        useState(false);

    const [cancelReason, setCancelReason] =
        useState("");

    useEffect(() => {
        if (order) {
            setStatus(order.status);
        }
    }, [order]);

    if (isLoading) {
        return (
            <div>Loading order...</div>
        );
    }

    if (!order) {
        return (
            <div>Order not found</div>
        );
    }

    const handleStatusUpdate =
        async () => {
            try {
                await updateOrderStatus.mutateAsync({
                    params: {
                        id,
                    },

                    body: {
                        status:
                            status as any,
                    },
                });

                await refetch();

                alert(
                    "Status updated successfully"
                );
            } catch (error) {
                console.error(error);

                alert(
                    "Failed to update status"
                );
            }
        };
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Order Details
            </h1>

            <div className="border rounded p-4">
                <h2 className="text-xl font-semibold mb-4">
                    Customer Information
                </h2>

                <p>
                    <strong>Name:</strong>{" "}
                    {order.customerName}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {order.phone}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {order.status}
                </p>

                <p>
                    <strong>Total:</strong> ₹
                    {order.totalAmount}
                </p>

                <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                        order.createdAt
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Address:</strong>{" "}
                    {order.deliveryAddress}
                </p>

                <p>
                    <strong>Pincode:</strong>{" "}
                    {order.pincode}
                </p>

                <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod}
                </p>

                <p>
                    <strong>Payment Status:</strong>{" "}
                    {order.paymentStatus}
                </p>

                {order.transactionId && (
                    <p>
                        <strong>Transaction ID:</strong>{" "}
                        {order.transactionId}
                    </p>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-3">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CUTTING">CUTTING</option>
                    <option value="PACKING">PACKING</option>
                    <option value="OUT_FOR_DELIVERY">
                        OUT_FOR_DELIVERY
                    </option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                    onClick={handleStatusUpdate}
                    className="border px-4 py-2 rounded"
                >
                    Update Status
                </button>
                {order.status !== "DELIVERED" &&
                    order.status !== "CANCELLED" && (
                        <button
                            onClick={() =>
                                setShowCancelModal(true)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            ❌ Cancel Order
                        </button>
                    )}
            </div>

            <div className="border rounded p-4">
                <h2 className="text-xl font-semibold mb-4">
                    Ordered Items
                </h2>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">
                                    Product
                                </th>

                                <th className="p-2 text-left">
                                    Quantity
                                </th>

                                <th className="p-2 text-left">
                                    Cutting
                                </th>

                                <th className="p-2 text-left">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map(
                                (item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b"
                                    >
                                        <td className="p-2">
                                            {
                                                item.product
                                                    .tamilName
                                            }
                                        </td>

                                        <td className="p-2">
                                            {
                                                item.quantityGrams
                                            }
                                            g
                                        </td>

                                        <td className="p-2">
                                            {
                                                item.cuttingOption
                                            }
                                        </td>

                                        <td className="p-2">
                                            ₹{Number(item.subtotal).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Mobile */}
                <div className="md:hidden space-y-3">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4"
                        >
                            <h3 className="font-semibold text-lg">
                                {item.product.tamilName}
                            </h3>

                            <div className="mt-2 space-y-1 text-sm">
                                <p>
                                    <span className="font-medium">
                                        Quantity:
                                    </span>{" "}
                                    {item.quantityGrams}g
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Cutting:
                                    </span>{" "}
                                    {item.cuttingOption}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Amount:
                                    </span>{" "}
                                    ₹{Number(item.subtotal).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                        <div className="bg-white rounded-lg p-6 w-[400px]">

                            <h2 className="text-xl font-bold mb-4">
                                Cancel Order
                            </h2>

                            <textarea
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(
                                        e.target.value
                                    )
                                }
                                className="border w-full p-2 rounded"
                                rows={4}
                                placeholder="Reason..."
                            />

                            <div className="flex justify-end gap-3 mt-5">

                                <button
                                    onClick={() =>
                                        setShowCancelModal(false)
                                    }
                                    className="border px-4 py-2 rounded"
                                >
                                    Close
                                </button>

                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Cancel Order
                                </button>

                            </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}