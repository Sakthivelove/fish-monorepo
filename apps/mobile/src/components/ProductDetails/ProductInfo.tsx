import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../theme/colors";

type Props = {
  name: string;
  tamilName: string;
  category: string;
  stock: number;
  description: string;
};

export default function ProductInfo({
  name,
  tamilName,
  category,
  stock,
  description,
}: Props) {
  return (
    <View>
      <Text style={styles.title}>
        {name}
      </Text>

      <Text style={styles.tamilName}>
        {tamilName}
      </Text>

      <Text style={styles.label}>
        Category : {category}
      </Text>

      <Text style={styles.label}>
        Stock : {stock / 1000} Kg
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  tamilName: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  label: {
    fontSize: 17,
    marginTop: 14,
    color: Colors.text,
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
});