"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useInventory,
  useUpdateStock,
} from "@/lib/inventory";

export default function InventoryPage() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useInventory();

  const updateStock =
    useUpdateStock();

  const items = data?.body ?? [];

  const [stockValues, setStockValues] =
    useState<Record<string, number>>(
      {}
    );

  const handleUpdate = async (
    productId: string
  ) => {
    try {
      const value =
        stockValues[productId];

      if (
        value === undefined ||
        value < 0
      ) {
        alert(
          "Enter a valid stock quantity"
        );
        return;
      }

      await updateStock.mutateAsync({
        params: {
          productId,
        },

        body: {
          stockQuantityGrams:
            value,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

    } catch (error) {
      console.error(error);

      alert(
        "Failed to update stock"
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Failed to load inventory
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Inventory
      </h1>
      {/*Desktop */}
      <div className="hidden md:block border rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Current Stock
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Update Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.productId}
                className={`border-b ${item.stockQuantityGrams ===
                  0
                  ? "bg-red-50"
                  : item.stockQuantityGrams <
                    1000
                    ? "bg-yellow-50"
                    : ""
                  }`}
              >
                <td className="p-3 font-medium">
                  {item.tamilName}
                </td>

                <td className="p-3">
                  {item.category}
                </td>

                <td className="p-3">
                  <div
                    className={`font-semibold ${item.stockQuantityGrams ===
                      0
                      ? "text-red-600"
                      : item.stockQuantityGrams <
                        1000
                        ? "text-yellow-600"
                        : "text-green-600"
                      }`}
                  >
                    {
                      item.stockQuantityGrams
                    }
                    g
                  </div>

                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{
                        width: `${Math.min(
                          item.stockQuantityGrams /
                          100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </td>

                <td className="p-3">
                  {item.stockQuantityGrams ===
                    0 ? (
                    <span className="text-red-600 font-semibold">
                      ❌ Out of Stock
                    </span>
                  ) : item.stockQuantityGrams <
                    1000 ? (
                    <span className="text-yellow-600 font-semibold">
                      ⚠ Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      ✅ In Stock
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2 items-center">

                    <input
                      type="number"
                      min={0}
                      value={
                        stockValues[
                        item.productId
                        ] ??
                        item.stockQuantityGrams
                      }
                      onChange={(e) =>
                        setStockValues(
                          (prev) => ({
                            ...prev,
                            [item.productId]:
                              Number(
                                e.target
                                  .value
                              ),
                          })
                        )
                      }
                      className="border p-2 w-32 rounded"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setStockValues(
                          (prev) => ({
                            ...prev,
                            [item.productId]:
                              (prev[
                                item
                                  .productId
                              ] ??
                                item.stockQuantityGrams) +
                              500,
                          })
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      +500g
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStockValues(
                          (prev) => ({
                            ...prev,
                            [item.productId]:
                              (prev[
                                item
                                  .productId
                              ] ??
                                item.stockQuantityGrams) +
                              1000,
                          })
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      +1kg
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStockValues(
                          (prev) => ({
                            ...prev,
                            [item.productId]:
                              (prev[
                                item
                                  .productId
                              ] ??
                                item.stockQuantityGrams) +
                              5000,
                          })
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      +5kg
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStockValues(
                          (prev) => ({
                            ...prev,
                            [item.productId]:
                              (prev[
                                item
                                  .productId
                              ] ??
                                item.stockQuantityGrams) +
                              10000,
                          })
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      +10kg
                    </button>

                    <button
                      onClick={() =>
                        handleUpdate(
                          item.productId
                        )
                      }
                      disabled={
                        updateStock.isPending
                      }
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
<div className="md:hidden space-y-4">
  {items.map((item) => (
    <div
      key={item.productId}
      className={`border rounded-lg p-4 shadow-sm ${
        item.stockQuantityGrams === 0
          ? "bg-red-50"
          : item.stockQuantityGrams < 1000
          ? "bg-yellow-50"
          : ""
      }`}
    >
      <h3 className="font-bold text-lg">
        {item.tamilName}
      </h3>

      <p className="text-sm text-gray-600">
        {item.category}
      </p>

      <div className="mt-3">
        <div
          className={`font-semibold ${
            item.stockQuantityGrams === 0
              ? "text-red-600"
              : item.stockQuantityGrams < 1000
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {item.stockQuantityGrams}g
        </div>

        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{
              width: `${Math.min(
                item.stockQuantityGrams / 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-3">
        {item.stockQuantityGrams === 0 ? (
          <span className="text-red-600 font-semibold">
            ❌ Out of Stock
          </span>
        ) : item.stockQuantityGrams < 1000 ? (
          <span className="text-yellow-600 font-semibold">
            ⚠ Low Stock
          </span>
        ) : (
          <span className="text-green-600 font-semibold">
            ✅ In Stock
          </span>
        )}
      </div>

      <input
        type="number"
        min={0}
        value={
          stockValues[item.productId] ??
          item.stockQuantityGrams
        }
        onChange={(e) =>
          setStockValues((prev) => ({
            ...prev,
            [item.productId]: Number(
              e.target.value
            ),
          }))
        }
        className="border p-2 rounded w-full mt-4"
      />

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          type="button"
          onClick={() =>
            setStockValues((prev) => ({
              ...prev,
              [item.productId]:
                (prev[item.productId] ??
                  item.stockQuantityGrams) + 500,
            }))
          }
          className="border px-2 py-2 rounded"
        >
          +500g
        </button>

        <button
          type="button"
          onClick={() =>
            setStockValues((prev) => ({
              ...prev,
              [item.productId]:
                (prev[item.productId] ??
                  item.stockQuantityGrams) + 1000,
            }))
          }
          className="border px-2 py-2 rounded"
        >
          +1kg
        </button>

        <button
          type="button"
          onClick={() =>
            setStockValues((prev) => ({
              ...prev,
              [item.productId]:
                (prev[item.productId] ??
                  item.stockQuantityGrams) + 5000,
            }))
          }
          className="border px-2 py-2 rounded"
        >
          +5kg
        </button>

        <button
          type="button"
          onClick={() =>
            setStockValues((prev) => ({
              ...prev,
              [item.productId]:
                (prev[item.productId] ??
                  item.stockQuantityGrams) + 10000,
            }))
          }
          className="border px-2 py-2 rounded"
        >
          +10kg
        </button>
      </div>

      <button
        onClick={() =>
          handleUpdate(item.productId)
        }
        disabled={updateStock.isPending}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Update Stock
      </button>
    </div>
  ))}

  {items.length === 0 && (
    <div className="text-center p-6 border rounded">
      No inventory items found
    </div>
  )}
</div>
    </div>
  );
}