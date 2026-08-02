import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "../../theme/colors";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>
          Deliver To
        </Text>

        <Text style={styles.location}>
          Coimbatore
        </Text>
      </View>

      <Text style={styles.icon}>
        🔔
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  location: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 4,
  },

  icon: {
    fontSize: 24,
  },
});