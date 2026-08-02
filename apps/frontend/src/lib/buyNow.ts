import { CartItem } from "@/lib/cart";

const BUY_NOW_KEY = "buy_now_item";

export function setBuyNowItem(item: CartItem) {
  localStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
}

export function getBuyNowItem(): CartItem | null {
  const value = localStorage.getItem(BUY_NOW_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearBuyNowItem() {
  localStorage.removeItem(BUY_NOW_KEY);
}