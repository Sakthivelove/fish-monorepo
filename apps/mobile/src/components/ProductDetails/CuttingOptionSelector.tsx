import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../theme/colors";
import { CUTTING_OPTIONS } from "../../constants/cuttingOptions";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CuttingOptionSelector({
  value,
  onChange,
}: Props) {
  return (
    <View>
      <Text style={styles.label}>Cutting Option</Text>

      <View style={styles.row}>
        {CUTTING_OPTIONS.map((option) => {
          const selected = option === value;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
    marginTop: 14,
    marginBottom: 8,
    color: Colors.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  chipText: {
    fontSize: 14,
    color: Colors.text,
  },

  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
