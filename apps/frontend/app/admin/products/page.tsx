"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
    useProducts,
    useDeleteProduct,
    useUpdateProduct,
} from "@/lib/products";

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
            <div>Loading products...</div>
        );
    }

    if (error) {
        return (
            <div>
                Failed to load products
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Products
                </h1>

                <Link
                    href="/admin/products/create"
                    className="border px-4 py-2 rounded"
                >
                    Add Product
                </Link>
            </div>
            {/* Desktop */}
            <div className="hidden md:block border rounded">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">
                                Tamil Name
                            </th>

                            <th className="p-3 text-left">
                                Category
                            </th>

                            <th className="p-3 text-left">
                                Price/Kg
                            </th>

                            <th className="p-3 text-left">
                                Stock
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(
                            (product) => (
                                <tr
                                    key={product.id}
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {
                                            product.tamilName
                                        }
                                    </td>

                                    <td className="p-3">
                                        {
                                            product.category
                                        }
                                    </td>

                                    <td className="p-3">
                                        ₹
                                        {
                                            product.pricePerKg
                                        }
                                    </td>

                                    <td className="p-3">
                                        {
                                            product.stockQuantityGrams
                                        }
                                        g
                                    </td>

                                    <td className="p-3">
                                        {product.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="px-3 py-1 border rounded text-blue-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleteProduct.isPending}
                                                className="px-3 py-1 border rounded text-red-600"
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={() =>
                                                    toggleProductStatus(
                                                        product.id,
                                                        !product.isActive
                                                    )
                                                }
                                                disabled={updateProduct.isPending}
                                                className="px-3 py-1 border rounded"
                                            >
                                                {product.isActive
                                                    ? "Disable"
                                                    : "Enable"}
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
                                    className="p-6 text-center"
                                >
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            {/* Mobile */}
            <div className="md:hidden space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-lg p-4"
                    >
                        <h3 className="font-bold text-lg">
                            {product.tamilName}
                        </h3>

                        <div className="mt-2 space-y-1 text-sm">
                            <p>
                                <span className="font-medium">
                                    Category:
                                </span>{" "}
                                {product.category}
                            </p>

                            <p>
                                <span className="font-medium">
                                    Price:
                                </span>{" "}
                                ₹{product.pricePerKg}/kg
                            </p>

                            <p>
                                <span className="font-medium">
                                    Stock:
                                </span>{" "}
                                {product.stockQuantityGrams}g
                            </p>

                            <p>
                                <span className="font-medium">
                                    Status:
                                </span>{" "}
                                {product.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="border px-3 py-2 rounded text-blue-600"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() =>
                                    toggleProductStatus(
                                        product.id,
                                        !product.isActive
                                    )
                                }
                                className="border px-3 py-2 rounded"
                            >
                                {product.isActive
                                    ? "Disable"
                                    : "Enable"}
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(product.id)
                                }
                                className="border px-3 py-2 rounded text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}