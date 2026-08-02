import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs, { MainTabParamList } from "./MainTabs";
import ProductDetailsScreen from "../screens/Products/ProductDetailsScreen";
import CheckoutScreen from "../screens/Checkout/CheckoutScreen";
import ProductListScreen from "../screens/Products/ProductListScreen";
import OrderDetailsScreen from "../screens/Orders/OrderDetailsScreen";

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
        headerShown: false
      }}
    >

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
      />

    </Stack.Navigator>
  );
}