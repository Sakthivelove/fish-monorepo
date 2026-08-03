import React, {
    createContext,
    useContext,
    useState,
} from "react";
import { useEffect } from "react";

import {
    saveCart,
    loadCart,
} from "../storage/cartStorage";

export type CartItem = {
    productId: string;
    name: string;
    pricePerKg: number;
    imageUrl: string;
    quantity: number;
    cuttingOption: string;
};

type CartContextType = {
    cart: CartItem[];

    addToCart: (item: CartItem) => void;

    increaseQuantity: (productId: string) => void;

    decreaseQuantity: (productId: string) => void;

    removeFromCart: (productId: string) => void;

    clearCart: () => void;

    totalPrice: number;
};

const CartContext = createContext<
    CartContextType | undefined
>(undefined);

export function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cart, setCart] = useState<CartItem[]>([]);
        useEffect(() => {
        async function initializeCart() {
            const storedCart = await loadCart();
            setCart(storedCart);
        }

        initializeCart();
    }, []);
    useEffect(() => {
        saveCart(cart);
    }, [cart]);
    const totalPrice = cart.reduce((total, item) => {
        return total + item.pricePerKg * item.quantity;
    }, 0);


    function addToCart(item: CartItem) {
        setCart((prev) => {
            const existing = prev.find(
                (p) => p.productId === item.productId
            );

            if (existing) {
                return prev.map((p) =>
                    p.productId === item.productId
                        ? {
                            ...p,
                            quantity: p.quantity + item.quantity,
                        }
                        : p
                );
            }

            return [...prev, item];
        });
    }

    function increaseQuantity(productId: string) {
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item
            )
        );
    }

    function decreaseQuantity(productId: string) {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(productId: string) {
        setCart((prev) =>
            prev.filter(
                (item) => item.productId !== productId
            )
        );
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used within CartProvider"
        );
    }

    return context;
}