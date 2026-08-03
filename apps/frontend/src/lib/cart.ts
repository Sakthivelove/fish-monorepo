export type CartItem = {
    productId: string;
    tamilName: string;
    imageUrl: string;
    pricePerKg: number;
    quantityGrams: number;
    cuttingOption: string;
};



const CART_KEY = "fish-cart";

export const getCart = (): CartItem[] => {
    if (typeof window === "undefined") {
        return [];
    }

    const data =
        localStorage.getItem(CART_KEY);

    return data
        ? JSON.parse(data)
        : [];
};

export const saveCart = (
    cart: CartItem[]
) => {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
};

export const addToCart = (
    item: CartItem
) => {
    const cart = getCart();

    const existing =
        cart.find(
            (c) =>
                c.productId ===
                item.productId
        );

    if (existing) {
        existing.quantityGrams +=
            item.quantityGrams;
    } else {
        cart.push(item);
    }

    saveCart(cart);

    window.dispatchEvent(
        new Event("cartUpdated")
    );
};

export const removeFromCart = (
    productId: string
) => {
    const cart = getCart().filter(
        (item) =>
            item.productId !== productId
    );

    saveCart(cart);

    window.dispatchEvent(
        new Event("cartUpdated")
    );
};

export const clearCart = () => {
    saveCart([]);
    window.dispatchEvent(
        new Event("cartUpdated")
    );
};

export const updateCartQuantity = (
    productId: string,
    quantityGrams: number
) => {
    const cart = getCart();

    const item = cart.find(
        (c) => c.productId === productId
    );

    if (item) {
        item.quantityGrams =
            quantityGrams;

        saveCart(cart);
    }
};

export const getCartTotal = () => {
    return getCart().reduce(
        (sum, item) =>
            sum +
            (item.pricePerKg *
                item.quantityGrams) /
            1000,
        0
    );
};

export const getCartItemsCount =
    () => {
        return getCart().length;
    };

export function updateCartItemQuantity(
  productId: string,
  quantityGrams: number
) {
  const cart = getCart();

  const updated = cart.map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantityGrams,
        }
      : item
  );

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(updated)
  );
}

export function incrementCartItem(
  productId: string
) {
  const cart = getCart();

  const updated = cart.map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantityGrams:
            item.quantityGrams + 250,
        }
      : item
  );

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(updated)
  );
}

export function decrementCartItem(
  productId: string
) {
  const cart = getCart();

  const updated = cart.map((item) => {
    if (item.productId !== productId)
      return item;

    return {
      ...item,
      quantityGrams: Math.max(
        250,
        item.quantityGrams - 250
      ),
    };
  });

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(updated)
  );
}