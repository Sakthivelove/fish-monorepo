import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CartScreen from "../screens/Cart/CartScreen";
import OrdersScreen from "../screens/Orders/OrdersScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import { useCart } from "../context/CartContext";
import Colors from "../theme/colors";

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const ICONS: Record<
  keyof MainTabParamList,
  keyof typeof Ionicons.glyphMap
> = {
  Home: "home",
  Cart: "cart",
  Orders: "receipt",
  Profile: "person",
};

const Tab =
  createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Each screen renders its own title/header inside its own
        // SafeAreaView — the default tab-navigator header would just
        // duplicate it, so it's turned off here.
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={
              focused
                ? ICONS[route.name]
                : (`${ICONS[route.name]}-outline` as keyof typeof Ionicons.glyphMap)
            }
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge:
            cartCount > 0 ? cartCount : undefined,
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
