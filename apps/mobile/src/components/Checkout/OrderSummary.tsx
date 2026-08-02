import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CartItem } from "../../context/CartContext";
import Colors from "../../theme/colors";

type Props = {
  items: CartItem[];
};

export default function OrderSummary({ items }: Props) {
  return (
    <View>
      {items.map((item) => (
        <View
          key={item.productId}
          style={styles.row}
        >
          <View style={styles.left}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.meta}>
              {item.quantity} Kg · {item.cuttingOption}
            </Text>
          </View>

          <Text style={styles.subtotal}>
            ₹ {item.pricePerKg * item.quantity}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  left: {
    flex: 1,
    paddingRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },

  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  subtotal: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
