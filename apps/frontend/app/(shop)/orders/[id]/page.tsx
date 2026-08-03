"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/lib/orders";
import { useCancelOrder } from "@/lib/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
const getStatusTamil = (
  status: string
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

const ORDER_STEPS = [
  "PENDING",
  "CONFIRMED",
  "CUTTING",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const cancelOrder = useCancelOrder();

  const router = useRouter();

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelReason, setCancelReason] =
    useState("");

  const handleCancelOrder = async () => {
    try {
      await cancelOrder.mutateAsync({
        params: {
          id: order.id,
        },
        body: {
          cancelledBy: "CUSTOMER",
          reason: cancelReason,
        },
      });

      alert("Order cancelled successfully");

      setShowCancelModal(false);

      router.refresh();
    } catch (err) {
      console.error(err);

      alert("Failed to cancel order");
    }
  };

  const {
    data,
    isLoading,
    error,
  } = useOrder(id);

  if (isLoading) {
    return (
      <div className="p-6">
        Loading order...
      </div>
    );
  }

  if (error || !data?.body) {
    return (
      <div className="p-6">
        Order not found
      </div>
    );
  }

  const order = data.body;

  const currentStepIndex =
    ORDER_STEPS.indexOf(order.status);

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">
        📦 ஆர்டர் விவரம்
      </h1>

      {/* STATUS TIMELINE */}

      <div className="border rounded-lg p-6 mb-6 bg-white">
        <h2 className="text-xl font-bold mb-6">
          ஆர்டர் நிலை
        </h2>

        {order.status ===
          "CANCELLED" ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg font-semibold">
            ❌ இந்த ஆர்டர் ரத்து
            செய்யப்பட்டுள்ளது
          </div>
        ) : (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <div className="flex items-center min-w-[700px]">
                {ORDER_STEPS.map(
                  (step, index) => {
                    const completed =
                      index <=
                      currentStepIndex;

                    return (
                      <div
                        key={step}
                        className="flex items-center flex-1"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                          ${completed
                                ? "bg-green-600"
                                : "bg-gray-300"
                              }`}
                          >
                            {completed
                              ? "✓"
                              : index + 1}
                          </div>

                          <span className="text-xs text-center mt-2 w-24">
                            {getStatusTamil(
                              step
                            )}
                          </span>
                        </div>

                        {index <
                          ORDER_STEPS.length -
                          1 && (
                            <div
                              className={`h-1 flex-1 mx-2
                          ${index <
                                  currentStepIndex
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                                }`}
                            />
                          )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="md:hidden space-y-4">
              {ORDER_STEPS.map((step, index) => {
                const completed =
                  index <= currentStepIndex;

                return (
                  <div
                    key={step}
                    className="flex items-start gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
            ${completed
                            ? "bg-green-600"
                            : "bg-gray-300"
                          }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      {index <
                        ORDER_STEPS.length - 1 && (
                          <div
                            className={`w-1 h-12 mt-1
              ${index <
                                currentStepIndex
                                ? "bg-green-600"
                                : "bg-gray-300"
                              }`}
                          />
                        )}
                    </div>

                    <div className="pt-2">
                      <p
                        className={`font-medium ${completed
                          ? "text-green-700"
                          : "text-gray-500"
                          }`}
                      >
                        {getStatusTamil(step)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ORDER INFO */}

      <div className="border rounded-lg p-6 mb-6 bg-white">
        <div className="space-y-2">
          <p>
            <strong>
              வாடிக்கையாளர்:
            </strong>{" "}
            {order.customerName}
          </p>

          <p>
            <strong>
              தொலைபேசி:
            </strong>{" "}
            {order.phone}
          </p>

          <p>
            <strong>நிலை:</strong>{" "}
            <span className="font-semibold text-blue-600">
              {getStatusTamil(
                order.status
              )}
            </span>
          </p>

          <p>
            <strong>
              மொத்த தொகை:
            </strong>{" "}
            ₹{order.totalAmount}
          </p>

          <p>
            <strong>தேதி:</strong>{" "}
            {new Date(
              order.createdAt
            ).toLocaleString(
              "ta-IN"
            )}
          </p>

          <p className="break-words">
            <strong>முகவரி:</strong>
            <br />
            {order.deliveryAddress}
          </p>

          <p>
            <strong>Pincode:</strong>
            {order.pincode}
          </p>

          <p>
            <strong>கட்டண முறை:</strong>
            {order.paymentMethod}
          </p>

          <p>
            <strong>கட்டண நிலை:</strong>
            {order.paymentStatus}
          </p>
          {(order.status === "PENDING" ||
            order.status === "CONFIRMED") && (
              <div className="mt-6 border-t pt-4">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  ❌ Order Cancel
                </button>
              </div>
            )}
        </div>
      </div>

      {/* ITEMS */}

      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">
          ஆர்டர் செய்யப்பட்ட பொருட்கள்
        </h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">
                  பொருள்
                </th>

                <th className="p-2 text-left">
                  அளவு
                </th>

                <th className="p-2 text-left">
                  வெட்டும் முறை
                </th>

                <th className="p-2 text-left">
                  தொகை
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
                      ₹
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/*mobile view*/}
        <div className="md:hidden space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-semibold">
                {item.product.tamilName}
              </h3>

              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">
                    அளவு:
                  </span>{" "}
                  {item.quantityGrams}g
                </p>

                <p>
                  <span className="font-medium">
                    வெட்டும் முறை:
                  </span>{" "}
                  {item.cuttingOption}
                </p>

                <p>
                  <span className="font-medium">
                    தொகை:
                  </span>{" "}
                  ₹{Number(item.subtotal).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Cancel Order
            </h2>

            <p className="mb-4">
              Are you sure you want to cancel this
              order?
            </p>

            <textarea
              className="border rounded w-full p-2"
              rows={4}
              placeholder="Reason"
              value={cancelReason}
              onChange={(e) =>
                setCancelReason(e.target.value)
              }
            />

            <div className="flex justify-end gap-3 mt-6">
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
                disabled={
                  cancelOrder.isPending ||
                  cancelReason.trim() === ""
                }
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {cancelOrder.isPending
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}