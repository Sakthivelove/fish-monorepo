"use client";

import { useState } from "react";
import ProductsGrid from "@/components/products/ProductsGrid";

const categories = [
  "ALL",
  "மீன்",
  "நண்டு",
  "இறால்",
];

export default function ProductsPage() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center py-10 mb-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-800">
          🎣 மொத்த மீன் வகைகள்
        </h1>

        <p className="text-lg mt-2 text-gray-700">
          நேரடியாகக் கடற்கரையில் இருந்து
          கிடைக்கும் அனைத்துப் புதிய
          கடல் உணவுகளையும் ஆராயுங்கள்.
        </p>
      </header>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="மீன் பெயர் தேடுங்கள்..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Category Filter */}
      <section className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-gray-700">
          வகை வாரியாக வடிகட்டவும்:
        </h2>

        <div className="flex flex-wrap gap-3 mt-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={
                category === item
                  ? "px-4 py-2 bg-orange-500 text-white rounded-full"
                  : "px-4 py-2 bg-white border rounded-full"
              }
            >
              {item === "ALL"
                ? "அனைத்தும்"
                : item}
            </button>
          ))}
        </div>
      </section>

      <ProductsGrid
        search={search}
        category={category}
      />
    </main>
  );
}