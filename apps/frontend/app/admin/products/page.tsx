"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
    useProducts,
    useDeleteProduct,
    useUpdateProduct,
} from "@/lib/products";
import { Plus, Pencil, Trash2, Power } from "lucide-react";

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const {
        data,
        isLoading,
        error,
    } = useProducts(
        undefined,
        undefined,
        true
    );

    const deleteProduct =
        useDeleteProduct();

    const products =
        data?.body ?? [];

    const handleDelete = async (
        id: string
    ) => {
        const confirmed = window.confirm(
            "Delete this product?"
        );

        if (!confirmed) return;

        try {
            await deleteProduct.mutateAsync({
                params: {
                    id,
                },
            });

            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            alert(
                "Product deleted successfully"
            );

        } catch (error) {
            console.error(error);

            alert(
                "Failed to delete product"
            );
        }
    };

    const updateProduct =
        useUpdateProduct();

    const toggleProductStatus = async (
        id: string,
        isActive: boolean
    ) => {
        try {
            await updateProduct.mutateAsync({
                params: {
                    id,
                },

                body: {
                    isActive,
                },
            });

            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            alert(
                `Product ${isActive
                    ? "enabled"
                    : "disabled"
                } successfully`
            );

        } catch (error) {
            console.error(error);

            alert(
                "Failed to update product status"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center text-gray-400">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-600">
                Failed to load products.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Products
                </h1>

                <Link
                    href="/admin/products/create"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                            <th className="p-3 font-medium">Tamil Name</th>
                            <th className="p-3 font-medium">Category</th>
                            <th className="p-3 font-medium">Price/Kg</th>
                            <th className="p-3 font-medium">Stock</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(
                            (product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                                >
                                    <td className="p-3 font-medium text-gray-900">
                                        {product.tamilName}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {product.category}
                                    </td>

                                    <td className="p-3 text-gray-900">
                                        ₹{product.pricePerKg}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {product.stockQuantityGrams}g
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                product.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {product.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                            >
                                                <Pencil size={13} />
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    toggleProductStatus(
                                                        product.id,
                                                        !product.isActive
                                                    )
                                                }
                                                disabled={updateProduct.isPending}
                                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                                            >
                                                <Power size={13} />
                                                {product.isActive ? "Disable" : "Enable"}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleteProduct.isPending}
                                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}

                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-8 text-center text-gray-400"
                                >
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {product.tamilName}
                            </h3>
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    product.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {product.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-700">Category:</span>{" "}
                                {product.category}
                            </p>

                            <p>
                                <span className="font-medium text-gray-700">Price:</span>{" "}
                                ₹{product.pricePerKg}/kg
                            </p>

                            <p>
                                <span className="font-medium text-gray-700">Stock:</span>{" "}
                                {product.stockQuantityGrams}g
                            </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-blue-600"
                            >
                                <Pencil size={13} />
                                Edit
                            </Link>

                            <button
                                onClick={() =>
                                    toggleProductStatus(
                                        product.id,
                                        !product.isActive
                                    )
                                }
                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600"
                            >
                                <Power size={13} />
                                {product.isActive ? "Disable" : "Enable"}
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(product.id)
                                }
                                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-red-600"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <p className="p-6 text-center text-gray-400">
                        No products found
                    </p>
                )}
            </div>
        </div>
    );
}
