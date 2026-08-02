"use client";

import ProductCard from "@/components/ProductCard";

import {
  useProducts,
} from "@/lib/products";

export default function ProductsGrid({
  search,
  category,
}: {
  search: string;
  category: string;
}) {
  const {
    data,
    isLoading,
    error,
  } = useProducts(
    search,
    category === "ALL"
      ? undefined
      : category
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const products = data?.body ?? [];

  return (
    <>
      <h2 className="text-3xl font-semibold mb-6 border-b pb-2 text-blue-700">
        கிடைக்கும் பொருட்கள் ({products.length})
      </h2>

      {products.length === 0 ? (
        <p className="text-xl text-gray-500 text-center py-16">
          இன்று மீன் வரத்து இல்லை.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </>
  );
}