"use client";

import { useState } from "react";
import Link from "next/link";
import ProductsGrid from "@/components/products/ProductsGrid";

const categories = [
  "ALL",
  "மீன்",
  "நண்டு",
  "இறால்",
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  return (
    <main className="bg-gray-50">

      {/* ---------------- HERO ---------------- */}

      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-16 text-center">

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            புதிய கடல் மீன்கள்
          </h1>

          <p className="mt-5 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            தினமும் காலையில் கடற்கரையிலிருந்து நேரடியாக சேகரிக்கப்பட்ட
            தரமான மீன்கள் உங்கள் வீட்டிற்கே.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">

            <Link
              href="/products"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
            >
              🛒 அனைத்து பொருட்கள்
            </Link>

            <Link
              href="/cart"
              className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              🧺 Cart
            </Link>

          </div>

        </div>
      </section>

      {/* ---------------- SEARCH ---------------- */}

      <section className="container mx-auto px-4 mt-10">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-bold text-center text-blue-800">
            உங்கள் விருப்பமான மீனை தேடுங்கள்
          </h2>

          <div className="mt-5">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="🐟 மீன் பெயர்..."
              className="w-full border rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

      </section>

      {/* ---------------- CATEGORY ---------------- */}

      <section className="container mx-auto px-4 mt-8">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold text-gray-800">
            வகைகள்
          </h2>

          <div className="flex flex-wrap gap-3 mt-5">

            {categories.map((item) => (

              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-3 rounded-full transition font-medium

                ${
                  category === item
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 hover:bg-orange-100"
                }
                `}
              >
                {item === "ALL"
                  ? "அனைத்தும்"
                  : item}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ---------------- PRODUCTS ---------------- */}

      <section className="container mx-auto px-4 py-12">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-3xl font-bold text-blue-800">
              இன்றைய புதிய வரவு
            </h2>

            <p className="text-gray-600 mt-2">
              இன்று கிடைக்கும் அனைத்து புதிய கடல் உணவுகள்
            </p>

          </div>

        </div>

        <ProductsGrid
          search={search}
          category={category}
        />

      </section>

      {/* ---------------- WHY US ---------------- */}

      <section className="bg-white">

        <div className="container mx-auto px-4 py-16">

          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            ஏன் எங்களை தேர்வு செய்ய வேண்டும்?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            <div className="text-center p-6 rounded-xl bg-gray-50">

              <div className="text-5xl">
                🐟
              </div>

              <h3 className="font-bold mt-4">
                Fresh
              </h3>

              <p className="mt-2 text-gray-600">
                தினமும் புதிய மீன்
              </p>

            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50">

              <div className="text-5xl">
                🚚
              </div>

              <h3 className="font-bold mt-4">
                Fast Delivery
              </h3>

              <p className="mt-2 text-gray-600">
                விரைவான டெலிவரி
              </p>

            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50">

              <div className="text-5xl">
                💰
              </div>

              <h3 className="font-bold mt-4">
                Best Price
              </h3>

              <p className="mt-2 text-gray-600">
                நியாயமான விலை
              </p>

            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50">

              <div className="text-5xl">
                ⭐
              </div>

              <h3 className="font-bold mt-4">
                Quality
              </h3>

              <p className="mt-2 text-gray-600">
                தரமான பொருட்கள்
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}