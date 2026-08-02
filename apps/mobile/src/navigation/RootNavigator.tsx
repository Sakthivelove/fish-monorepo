import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs, { MainTabParamList } from "./MainTabs";
import ProductDetailsScreen from "../screens/Products/ProductDetailsScreen";
import CheckoutScreen from "../screens/Checkout/CheckoutScreen";
import ProductListScreen from "../screens/Products/ProductListScreen";
import OrderDetailsScreen from "../screens/Orders/OrderDetailsScreen";
import Colors from "../theme/colors";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  ProductList: undefined;

  ProductDetails: {
    productId: string;
  };

  Checkout: undefined;

  OrderDetails: {
    orderId: string;
  };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        // The bottom-tab screens each render their own in-body
        // title/header — a stack header here would just duplicate it.
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: "All Products" }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        // Empty title (not "ProductDetails") — the product name and
        // image speak for themselves; only the back button matters
        // here.
        options={{ title: "" }}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}
