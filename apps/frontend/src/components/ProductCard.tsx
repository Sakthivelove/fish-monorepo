"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { setBuyNowItem } from "@/lib/buyNow";

type Props = {
  product: Product;
};
// ஒரு தனித் தயாரிப்பைக் காண்பிப்பதற்கான கூறு
export default function ProductCard({
  product,
}: Props) {
  const [quantityGrams, setQuantityGrams] =
    useState(1000);
  const router = useRouter();
  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      tamilName: product.tamilName,
      imageUrl: product.imageUrl,
      pricePerKg: product.pricePerKg,
      quantityGrams,
      cuttingOption: "NORMAL",
    });

    alert("வண்டியில் சேர்க்கப்பட்டது");
  };

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setBuyNowItem({
      productId: product.id,
      tamilName: product.tamilName,
      imageUrl: product.imageUrl,
      pricePerKg: product.pricePerKg,
      quantityGrams,
      cuttingOption: "NORMAL",
    });

    router.push("/checkout");
  };
  return (
    <div className="border rounded-xl shadow-lg overflow-hidden bg-white flex flex-col h-full transition hover:scale-[1.02] hover:shadow-2xl">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col flex-1"
      >
        <img
          src={product.imageUrl}
          alt={product.tamilName}
          className="w-full h-56 object-cover"
        />

        <div className="p-5 flex flex-col flex-1">
          <span className="inline-flex w-fit text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {product.category}
          </span>

          <h3 className="mt-3 text-2xl font-bold text-orange-600 leading-tight line-clamp-2 min-h-[64px]">
            {product.tamilName}
          </h3>

          <p className="text-xl font-mono text-green-600 mt-2">
            ₹
            {product.pricePerKg.toFixed(
              2
            )}{" "}
            / கி.கி
          </p>
          <div className="min-h-[42px] mt-3">
            {product.stockQuantityGrams > 0 ? (
              <>
                <p className="text-green-600 font-semibold">
                  ✔ Available
                </p>

                {product.stockQuantityGrams <= 1000 && (
                  <p className="text-orange-600 text-sm">
                    ⚠ Low Stock
                  </p>
                )}
              </>
            ) : (
              <p className="text-red-600 font-semibold">
                ✖ Out of Stock
              </p>
            )}
          </div>

          {/* <p className="text-sm text-gray-500 leading-6 line-clamp-2 min-h-[48px] mt-2">
            {product.description}
          </p> */}
        </div>
      </Link>
      <div className="border-t px-5 pt-4 pb-4">
        <label className="block text-sm font-medium mb-2">
          அளவு தேர்வு
        </label>

        <select
          value={quantityGrams}
          onChange={(e) =>
            setQuantityGrams(Number(e.target.value))
          }
          className="w-full border rounded-lg p-2"
        >
          <option value={250}>250g</option>
          <option value={500}>500g</option>
          <option value={1000}>1kg</option>
          <option value={2000}>2kg</option>
        </select>
      </div>

      <div className="px-5 pb-5 pt-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          🛒 Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition"
        >
          ⚡ Buy Now
        </button>
      </div>
    </div>

  );
}
