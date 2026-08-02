import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "../context/CartContext";

const CART_KEY = "cart";

export async function saveCart(cart: CartItem[]) {
  try {
    await AsyncStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.error("Failed to save cart", error);
  }
}

export async function loadCart() {
  try {
    const value = await AsyncStorage.getItem(CART_KEY);

    if (!value) {
      return [];
    }

    return JSON.parse(value) as CartItem[];
  } catch (error) {
    console.error("Failed to load cart", error);
    return [];
  }
}

export async function clearCartStorage() {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error(error);
  }
}