"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { useState } from "react";
import { setBuyNowItem } from "@/lib/buyNow";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [quantityGrams,
        setQuantityGrams] =
        useState(1000);

    const id = params.id as string;

    const {
        data,
        isLoading,
        error,
    } = useProduct(id);

    const product = data?.body;

    if (isLoading) {
        return (
            <div className="p-6">
                Loading product...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6">
                Product not found
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            productId: product.id,
            tamilName:
                product.tamilName,
            imageUrl:
                product.imageUrl,
            pricePerKg:
                product.pricePerKg,
            quantityGrams,
            cuttingOption:"NORMAL",
        });

        alert(
            `${quantityGrams}g வண்டியில் சேர்க்கப்பட்டது`
        );
    };

    const handleBuyNow = () => {
    if (!product) return;

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

    const totalPrice =
        product
            ? (
                product.pricePerKg *
                quantityGrams
            ) / 1000
            : 0;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-8">

                <img
                    src={product.imageUrl}
                    alt={product.tamilName}
                    className="w-full rounded-lg border"
                />

                <div>

                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded">
                        {product.category}
                    </span>

                    <h1 className="text-4xl font-bold mt-4">
                        {product.tamilName}
                    </h1>

                    {product.name && (
                        <p className="text-gray-500 mt-2">
                            {product.name}
                        </p>
                    )}

                    <p className="text-3xl font-bold text-green-600 mt-6">
                        ₹{product.pricePerKg}
                        <span className="text-lg">
                            {" "}
                            / கிலோ
                        </span>
                    </p>

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">
                            விளக்கம்
                        </h3>

                        <p className="text-gray-700">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-6">
                        {product.stockQuantityGrams >
                            0 ? (
                            <span className="text-green-600 font-semibold">
                                கிடைக்கிறது
                            </span>
                        ) : (
                            <span className="text-red-600 font-semibold">
                                Stock இல்லை
                            </span>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">
                            அளவு தேர்வு
                        </h3>

                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantityGrams(250)
                                }
                                className={`border px-3 py-2 rounded ${quantityGrams === 250
                                    ? "bg-blue-600 text-white"
                                    : ""
                                    }`}
                            >
                                250g
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantityGrams(500)
                                }
                                className={`border px-3 py-2 rounded ${quantityGrams === 500
                                    ? "bg-blue-600 text-white"
                                    : ""
                                    }`}
                            >
                                500g
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantityGrams(1000)
                                }
                                className={`border px-3 py-2 rounded ${quantityGrams === 1000
                                    ? "bg-blue-600 text-white"
                                    : ""
                                    }`}
                            >
                                1kg
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantityGrams(2000)
                                }
                                className={`border px-3 py-2 rounded ${quantityGrams === 2000
                                    ? "bg-blue-600 text-white"
                                    : ""
                                    }`}
                            >
                                2kg
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-semibold">
                            மொத்த விலை
                        </h3>

                        <p className="text-2xl font-bold text-green-600">
                            ₹{totalPrice.toFixed(2)}
                        </p>
                    </div>

<div className="mt-8 grid grid-cols-2 gap-3">
    <button
        onClick={handleAddToCart}
        disabled={product.stockQuantityGrams <= 0}
        className="bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400"
    >
        🛒 வண்டியில் சேர்
    </button>

    <button
        onClick={handleBuyNow}
        disabled={product.stockQuantityGrams <= 0}
        className="bg-orange-500 text-white py-3 rounded-lg disabled:bg-gray-400"
    >
        ⚡ உடனே வாங்க
    </button>
</div>
                </div>
            </div>
        </div>
    );
}