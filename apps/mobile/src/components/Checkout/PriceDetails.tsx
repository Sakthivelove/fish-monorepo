import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../theme/colors";

const DELIVERY_FEE = 0;

type Props = {
  itemsTotal: number;
};

export default function PriceDetails({
  itemsTotal,
}: Props) {
  const total = itemsTotal + DELIVERY_FEE;

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>Items Total</Text>
        <Text style={styles.value}>₹ {itemsTotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={styles.value}>
          {DELIVERY_FEE === 0 ? "Free" : `₹ ${DELIVERY_FEE}`}
        </Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹ {total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  label: {
    fontSize: 15,
    color: Colors.textSecondary,
  },

  value: {
    fontSize: 15,
    color: Colors.text,
  },

  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.success,
  },
});
