"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrdersByPhone } from "@/lib/orders";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CUTTING"
  | "PACKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

const getStatusTamil = (
  status: OrderStatus
) => {
  switch (status) {
    case "PENDING":
      return "நிலுவையில்";

    case "CONFIRMED":
      return "உறுதி செய்யப்பட்டது";

    case "CUTTING":
      return "வெட்டப்படுகிறது";

    case "PACKING":
      return "பேக் செய்யப்படுகிறது";

    case "OUT_FOR_DELIVERY":
      return "டெலிவரிக்கு அனுப்பப்பட்டது";

    case "DELIVERED":
      return "டெலிவரி செய்யப்பட்டது";

    case "CANCELLED":
      return "ரத்து செய்யப்பட்டது";

    default:
      return status;
  }
};

const getStatusClass = (
  status: OrderStatus
) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";

    case "CUTTING":
      return "bg-orange-100 text-orange-800";

    case "PACKING":
      return "bg-purple-100 text-purple-800";

    case "OUT_FOR_DELIVERY":
      return "bg-cyan-100 text-cyan-800";

    case "DELIVERED":
      return "bg-green-100 text-green-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  const [inputPhone, setInputPhone] =
    useState("");

  const [searchPhone, setSearchPhone] =
    useState("");

  const {
    data,
    isLoading,
  } = useOrdersByPhone(searchPhone);

  const orders = data?.body ?? [];

  const handleSearch = () => {
    if (
      !/^[0-9]{10}$/.test(
        inputPhone.trim()
      )
    ) {
      alert(
        "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்"
      );
      return;
    }

    setSearchPhone(
      inputPhone.trim()
    );
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center py-8 mb-10 bg-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold text-blue-800">
          📦 எனது ஆர்டர்கள்
        </h1>

        <p className="mt-2 text-gray-600">
          உங்கள் மொபைல் எண்ணை கொடுத்து
          ஆர்டர்களைப் பார்க்கலாம்
        </p>
      </header>

      <div className="max-w-xl mx-auto bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <label className="block mb-2 font-medium">
          மொபைல் எண்
        </label>

        <input
          type="tel"
          maxLength={10}
          value={inputPhone}
          onChange={(e) =>
            setInputPhone(
              e.target.value
            )
          }
          placeholder="9876543210"
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading
            ? "தேடுகிறது..."
            : "ஆர்டர்களை காண்க"}
        </button>
      </div>

      {searchPhone &&
        !isLoading &&
        orders.length === 0 && (
          <div className="text-center border rounded p-8">
            <p className="mb-4">
              இந்த எண்ணிற்கு
              ஆர்டர்கள் எதுவும் இல்லை.
            </p>

            <Link
              href="/products"
              className="inline-block bg-orange-500 text-white px-4 py-2 rounded"
            >
              மீன் வகைகளை பார்க்க
            </Link>
          </div>
        )}

      {orders.length > 0 && (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-lg">
                    ஆர்டர் எண் #
                    {order.id.slice(
                      0,
                      8
                    )}
                  </h2>

                  <p className="text-gray-500">
                    {
                      order.customerName
                    }
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                    order.status
                  )}`}
                >
                  {getStatusTamil(
                    order.status
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>
                    தொலைபேசி:
                  </strong>{" "}
                  {order.phone}
                </p>

                <p>
                  <strong>
                    மொத்த தொகை:
                  </strong>{" "}
                  ₹
                  {
                    order.totalAmount
                  }
                </p>

                <p>
                  <strong>
                    தேதி:
                  </strong>{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "ta-IN"
                  )}
                </p>
              </div>

              <div className="mt-4">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  ஆர்டர் விவரம் →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}