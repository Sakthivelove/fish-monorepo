import React from "react";
import {
  Image,
  StyleSheet,
  View,
} from "react-native";

export default function Banner() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200",
        }}
        resizeMode="cover"
        style={styles.image}
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