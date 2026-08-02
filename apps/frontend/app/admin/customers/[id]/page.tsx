"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCustomer } from "@/lib/customers";

export default function CustomerDetailsPage() {
  const params = useParams();

  const customerId =
    params.id as string;

  const {
    data,
    isLoading,
    error,
  } = useCustomer(customerId);

  const customer = data?.body;

  if (isLoading) {
    return (
      <div>
        Loading customer...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div>
        Customer not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Customer Details
      </h1>

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Customer Information
        </h2>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong>{" "}
            {customer.name}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {customer.phoneNumber}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {customer.email ?? "-"}
          </p>

          <p>
            <strong>Total Orders:</strong>{" "}
            {customer.totalOrders}
          </p>

          <p>
            <strong>Total Spent:</strong> ₹
            {customer.totalSpent}
          </p>
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">
          Order History
        </h2>

        {customer.orders.length ===
          0 ? (
          <p>
            No orders found.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">
                      Order ID
                    </th>

                    <th className="p-3 text-left">
                      Date
                    </th>

                    <th className="p-3 text-left">
                      Amount
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
                  {customer.orders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b"
                      >
                        <td className="p-3">
                          {order.id.slice(
                            0,
                            8
                          )}
                          ...
                        </td>

                        <td className="p-3">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          ₹
                          {
                            order.totalAmount
                          }
                        </td>

                        <td className="p-3">
                          {order.status}
                        </td>

                        <td className="p-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600"
                          >
                            View Order
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-semibold text-blue-700">
                    Order #{order.id.slice(0, 8)}
                  </h3>

                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">
                        Date:
                      </span>{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

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
        )}
      </div>
    </div>
  );
}