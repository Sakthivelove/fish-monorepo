"use client";

import {
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  incrementCartItem,
  decrementCartItem,
} from "@/lib/cart";
import { clearBuyNowItem } from "@/lib/buyNow";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState(() => getCart());
  const router = useRouter();

  const refreshCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.pricePerKg *
        item.quantityGrams) /
      1000,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        வண்டி
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          வண்டி காலியாக உள்ளது
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.tamilName}
                  className="w-28 h-28 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {item.tamilName}
                  </h3>

                  <p>
                    ₹
                    {
                      item.pricePerKg
                    }
                    /kg
                  </p>

                  <div className="mt-3 flex items-center gap-3">

                    <button
                      onClick={() => {
                        decrementCartItem(
                          item.productId
                        );
                        refreshCart();
                      }}
                      className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      −
                    </button>

                    <span className="font-medium">
                      {item.quantityGrams} g
                    </span>

                    <button
                      onClick={() => {
                        incrementCartItem(
                          item.productId
                        );
                        refreshCart();
                      }}
                      className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>

                  </div>

                  <p className="font-semibold">
                    ₹
                    {(
                      item.pricePerKg *
                      item.quantityGrams /
                      1000
                    ).toFixed(2)}
                  </p>

                  <p>
                    வெட்டும் முறை :
                    {item.cuttingOption}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "இந்த பொருளை வண்டியில் இருந்து நீக்கவா?"
                      )
                    ) {
                      removeFromCart(item.productId);
                      refreshCart();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold">
              Total :
              ₹
              {total.toFixed(2)}
            </h2>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => {
                  if (
                    confirm(
                      "முழு வண்டியையும் காலி செய்யவா?"
                    )
                  ) {
                    clearCart();
                    refreshCart();
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Clear Cart
              </button>

              <button
                onClick={() => {
                  clearBuyNowItem();
                  router.push("/checkout");
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}