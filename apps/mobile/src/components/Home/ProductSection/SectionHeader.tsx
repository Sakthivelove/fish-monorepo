import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../../theme/colors";

type Props = {
  title: string;
  onViewAll?: () => void;
};

export default function SectionHeader({
  title,
  onViewAll,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <Pressable onPress={onViewAll}>
        <Text style={styles.viewAll}>
          View All
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },

  viewAll: {
    color: Colors.primary,
    fontWeight: "600",
  },
});