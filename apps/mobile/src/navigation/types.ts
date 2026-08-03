import {
  CompositeScreenProps,
} from "@react-navigation/native";

import {
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { MainTabParamList } from "./MainTabs";
import { RootStackParamList } from "./RootNavigator";

/* ---------- Home ---------- */

export type HomeScreenProps =
  CompositeScreenProps<
    BottomTabScreenProps<
      MainTabParamList,
      "Home"
    >,
    NativeStackScreenProps<
      RootStackParamList
    >
  >;

/* ---------- Cart ---------- */

export type CartScreenProps =
  CompositeScreenProps<
    BottomTabScreenProps<
      MainTabParamList,
      "Cart"
    >,
    NativeStackScreenProps<
      RootStackParamList
    >
  >;

/* ---------- Orders ---------- */

export type OrdersScreenProps =
  CompositeScreenProps<
    BottomTabScreenProps<
      MainTabParamList,
      "Orders"
    >,
    NativeStackScreenProps<
      RootStackParamList
    >
  >;

/* ---------- Order Details ---------- */

export type OrderDetailsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "OrderDetails"
  >;

/* ---------- Profile ---------- */

export type ProfileScreenProps =
  BottomTabScreenProps<
    MainTabParamList,
    "Profile"
  >;

/* ---------- Product Details ---------- */

export type ProductDetailsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "ProductDetails"
  >;

/* ---------- Product List ---------- */

export type ProductListScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "ProductList"
  >;

/* ---------- Checkout ---------- */

export type CheckoutScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "Checkout"
  >;