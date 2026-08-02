import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/Cart/CartItem";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Colors from "../../theme/colors";
import { CartScreenProps } from "../../navigation/types";


export default function CartScreen({
    navigation,
}: CartScreenProps) {
  const { cart, totalPrice } = useCart();
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>Cart Screen</Text>
      <Text>

        Items : {cart.length}

      </Text>
      {cart.map((item) => (
        <CartItem
          key={item.productId}
          item={item}
        />
      ))}

      <View style={styles.footer}>
        <Text style={styles.total}>
          Total: ₹ {totalPrice}
        </Text>

        <PrimaryButton
          title="Checkout"
          onPress={() => {
            navigation.navigate("Checkout");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },

  total: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
});