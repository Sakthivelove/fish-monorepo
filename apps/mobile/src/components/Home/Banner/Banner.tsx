import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import RemoteImage from "../../RemoteImage";

export default function Banner() {
  return (
    <View style={styles.container}>
      <RemoteImage
        uri="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200"
        style={styles.image}
        borderRadius={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
});