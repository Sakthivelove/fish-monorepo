"use client";

import Link from "next/link";
import { useState } from "react";
import { useCustomers } from "@/lib/customers";

export default function CustomersPage() {
  const [search, setSearch] =
    useState("");
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useCustomers(search);

  const customers =
    data?.body ?? [];

  if (isLoading && !data) {
    return (
      <div>Loading customers...</div>
    );
  }

  if (error) {
    return (
      <div>
        Failed to load customers
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Customers
      </h1>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search customer..."
          className="border p-2 rounded w-full md:w-80"
        />

        <div className="h-5 mt-2">
          {isLoading && !data && (
            <p className="text-sm text-gray-500">
              Loading customers...
            </p>
          )}

          {isFetching && data && (
            <p className="text-sm text-gray-500">
              Searching...
            </p>
          )}
        </div>
      </div>

      <div className="hidden md:block border rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Phone
              </th>

              <th className="p-3 text-left">
                Email
              </th>

              <th className="p-3 text-left">
                Orders
              </th>

              <th className="p-3 text-left">
                Total Spent
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {error && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-red-600"
                >
                  Failed to load customers
                </td>
              </tr>
            )}

            {!error &&
              customers.map(
                (customer) => (
                  <tr
                    key={customer.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {customer.name}
                    </td>

                    <td className="p-3">
                      {
                        customer.phoneNumber
                      }
                    </td>

                    <td className="p-3">
                      {customer.email ??
                        "-"}
                    </td>

                    <td className="p-3">
                      {
                        customer.totalOrders
                      }
                    </td>

                    <td className="p-3">
                      ₹
                      {
                        customer.totalSpent
                      }
                    </td>

                    <td className="p-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              )}

            {!error &&
              !isFetching &&
              customers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-bold text-lg">
              {customer.name}
            </h3>

            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-medium">
                  Phone:
                </span>{" "}
                {customer.phoneNumber}
              </p>

              <p>
                <span className="font-medium">
                  Email:
                </span>{" "}
                {customer.email ?? "-"}
              </p>

              <p>
                <span className="font-medium">
                  Orders:
                </span>{" "}
                {customer.totalOrders}
              </p>

              <p>
                <span className="font-medium">
                  Total Spent:
                </span>{" "}
                ₹{customer.totalSpent}
              </p>
            </div>

            <Link
              href={`/admin/customers/${customer.id}`}
              className="mt-4 inline-block border px-4 py-2 rounded text-blue-600"
            >
              View Customer
            </Link>
          </div>
        ))}

        {!error &&
          !isFetching &&
          customers.length === 0 && (
            <div className="border rounded p-6 text-center">
              No customers found
            </div>
          )}
      </div>
    </div>
  );
}