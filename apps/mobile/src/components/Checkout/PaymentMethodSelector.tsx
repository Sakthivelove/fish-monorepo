import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../theme/colors";

export type PaymentMethod = "COD" | "UPI";

type Props = {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
};

const OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "UPI", label: "UPI" },
];

export default function PaymentMethodSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              selected && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },

  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  optionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },

  optionTextSelected: {
    color: "#fff",
  },
});
