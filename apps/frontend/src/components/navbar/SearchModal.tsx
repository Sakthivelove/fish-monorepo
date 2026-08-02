"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Search,
    X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useSearch } from "@/context/SearchContext";
import Link from "next/link";

import { useProducts } from "@/lib/products";
import { useDebounce } from "@/hooks/useDebounce";
import { highlightText } from "@/utils/highlight";
type Props = {
    open: boolean;
    onClose: () => void;
};

export default function SearchModal({
    open,
    onClose,
}: Props) {
    const router = useRouter();
    const [keyword, setKeyword] =
        useState("");
    const debouncedKeyword =
        useDebounce(keyword, 300);

    const {
        closeSearch,
    } = useSearch();

    const {
        data,
        isLoading,
    } = useProducts(debouncedKeyword);

    const products = data?.body ?? [];



    const inputRef =
        useRef<HTMLInputElement>(null);

    // Auto Focus
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // ESC Close
    useEffect(() => {
        const handleKeyDown = (
            e: KeyboardEvent
        ) => {
            if (!open) return;

            if (e.key === "Escape") {
                closeSearch();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [open, closeSearch]);

    if (!open) return null;

    const handleSearch = () => {
        const value = keyword.trim();

        if (!value) return;

        router.push(
            `/products?search=${encodeURIComponent(
                value
            )}`
        );

        setKeyword("");

        closeSearch();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-start justify-center px-4 py-20"
            onClick={closeSearch}
        >
            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}

                <div className="flex items-center gap-3 px-5 py-4 border-b">

                    <Search
                        size={22}
                        className="text-gray-500"
                    />

                    <input
                        ref={inputRef}
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter"
                            ) {
                                handleSearch();
                            }
                        }}
                        placeholder="மீன் பெயரை தேடுங்கள்..."
                        className="flex-1 text-lg outline-none placeholder:text-gray-400"
                    />

                    <button
                        onClick={closeSearch}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    {keyword.trim() === "" ? (

                        <div className="text-center text-gray-500 py-10">

                            <Search
                                size={42}
                                className="mx-auto mb-4 text-gray-300"
                            />

                            <p className="text-lg font-medium">
                                மீன் பெயரை தேடுங்கள்
                            </p>

                            <p className="text-sm mt-2">
                                Type செய்து தேட ஆரம்பியுங்கள்.
                            </p>

                        </div>

                    ) : isLoading ? (

                        <div className="py-10 text-center">
                            Searching...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="py-10 text-center text-gray-500">

                            <Search
                                size={42}
                                className="mx-auto mb-4 text-gray-300"
                            />

                            <p>பொருள் கிடைக்கவில்லை</p>

                        </div>

                    ) : (

                        <div className="max-h-[420px] overflow-y-auto">

                            {products.map((product) => (

                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={closeSearch}
                                    className="flex gap-4 p-3 rounded-xl hover:bg-gray-100 transition"
                                >

                                    <img
                                        src={product.imageUrl}
                                        alt={product.tamilName}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />

                                    <div className="flex-1">

                                        <h3 className="font-semibold text-lg">
                                            {highlightText(
                                                product.tamilName,
                                                keyword
                                            ).map((part, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        part.trim().toLowerCase() ===
                                                            keyword.trim().toLowerCase()
                                                            ? "bg-yellow-300"
                                                            : ""
                                                    }
                                                >
                                                    {part}
                                                </span>
                                            ))}
                                        </h3>

                                        <p className="text-green-600 font-bold">
                                            ₹{product.pricePerKg} / kg
                                        </p>

                                        {product.stockQuantityGrams > 0 ? (

                                            <p className="text-sm text-green-600">
                                                ✔ Available
                                            </p>

                                        ) : (

                                            <p className="text-sm text-red-600">
                                                ✖ Out of Stock
                                            </p>

                                        )}

                                    </div>

                                </Link>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}