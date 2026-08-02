import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuantitySelectorProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onDecrease}>
        <Text style={styles.buttonText}>−</Text>
      </Pressable>

      <Text style={styles.value}>{value} Kg</Text>

      <Pressable style={styles.button} onPress={onIncrease}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  value: {
    fontSize: 20,
    fontWeight: "600",
  },
});