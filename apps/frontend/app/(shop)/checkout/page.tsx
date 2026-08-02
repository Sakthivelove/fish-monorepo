"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    clearBuyNowItem,
    getBuyNowItem,
} from "@/lib/buyNow";

import {
    getCart,
    clearCart,
    CartItem,
} from "@/lib/cart";

import { useCreateOrder } from "@/lib/orders";

export default function CheckoutPage() {
    const router = useRouter();

    const createOrder =
        useCreateOrder();

    const [loading, setLoading] =
        useState(true);

    const [items, setItems] =
        useState<CartItem[]>([]);

    const [form, setForm] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        deliveryAddress: "",
        pincode: "",
        paymentMethod: "COD",
        transactionId: "",
    });

    useEffect(() => {
        const buyNow = getBuyNowItem();

        if (buyNow) {
            setItems([buyNow]);
        } else {
            setItems(getCart());
        }

        setLoading(false);
    }, []);

    const totalAmount =
        items.reduce(
            (sum, item) =>
                sum +
                (item.pricePerKg / 1000) *
                item.quantityGrams,
            0
        );

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (items.length === 0) {
            alert("Cart is empty");
            return;
        }

        try {
            const response =
                await createOrder.mutateAsync({
                    body: {
                        customer: {
                            name: form.name,
                            phoneNumber:
                                form.phoneNumber,
                            email: form.email.trim() || undefined,
                        },

                        deliveryAddress:
                            form.deliveryAddress,

                        pincode:
                            form.pincode,

                        paymentMethod:
                            form.paymentMethod as
                            | "COD"
                            | "UPI",

                        transactionId:
                            form.paymentMethod === "UPI"
                                ? form.transactionId
                                : null,

                        items: items.map((item) => ({
                            productId: item.productId,
                            quantityGrams: item.quantityGrams,
                            cuttingOption: item.cuttingOption,
                        })),
                    },
                });

            alert(
                "Order placed successfully"
            );

            if (getBuyNowItem()) {
                clearBuyNowItem();
            } else {
                clearCart();
            }

            router.push(
                `/orders/${response.body.id}`
            );
        } catch (error) {
            console.error(error);

            alert(
                "Failed to place order"
            );
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                Loading...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">
                    Checkout
                </h1>

                <div className="border rounded p-6 text-center">
                    <p>வண்டி காலியாக உள்ளது</p>

                    <button
                        onClick={() =>
                            router.push("/products")
                        }
                        className="mt-4 border px-4 py-2 rounded"
                    >
                        மீன் வகைகளை பார்க்க
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Customer Form */}

                <div className="border rounded p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Delivery Details
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />

                        <input
                            name="phoneNumber"
                            type="tel"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            inputMode="numeric"
                            placeholder="Phone Number"
                            value={
                                form.phoneNumber
                            }
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <textarea
                            name="deliveryAddress"
                            placeholder="Delivery Address"
                            value={
                                form.deliveryAddress
                            }
                            onChange={handleChange}
                            rows={4}
                            minLength={10}
                            className="w-full border p-2 rounded"
                            required
                        />

                        <input
                            name="pincode"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="Pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />

                        <select
                            name="paymentMethod"
                            value={
                                form.paymentMethod
                            }
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="COD">
                                Cash On Delivery
                            </option>

                            <option value="UPI">
                                UPI
                            </option>

                            {/* <option value="CARD">
                                Card
                            </option> */}
                        </select>

                        {form.paymentMethod === "UPI" && (
                            <input
                                name="transactionId"
                                placeholder="UPI Transaction ID"
                                value={form.transactionId}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                        )}

                        <button
                            type="submit"
                            disabled={
                                createOrder.isPending
                            }
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                        >
                            {createOrder.isPending
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}

                <div className="border rounded p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h2>

                    <div className="space-y-3">
                        {items.map(
                            (item) => (
                                <div
                                    key={
                                        item.productId
                                    }
                                    className="flex justify-between border-b pb-2"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {
                                                item.tamilName
                                            }
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {
                                                item.quantityGrams
                                            }
                                            g
                                        </p>
                                    </div>

                                    <div>
                                        ₹
                                        {(
                                            (item.pricePerKg /
                                                1000) *
                                            item.quantityGrams
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-6 border-t pt-4 flex justify-between text-xl font-bold">
                        <span>Total</span>

                        <span>
                            ₹
                            {totalAmount.toFixed(
                                2
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}