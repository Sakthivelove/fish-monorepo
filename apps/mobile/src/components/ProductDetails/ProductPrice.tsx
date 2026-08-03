import React from "react";
import {
  StyleSheet,
  Text,
} from "react-native";

import Colors from "../../theme/colors";

type Props = {
  price: number;
};

export default function ProductPrice({
  price,
}: Props) {
  return (
    <Text style={styles.price}>
      ₹ {price} / Kg
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.success,
    marginTop: 18,
    marginBottom: 12,
  },
});