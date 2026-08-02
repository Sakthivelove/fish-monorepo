import React from "react";
import { Image, StyleSheet } from "react-native";

type Props = {
  imageUrl: string;
};

export default function ProductImage({
  imageUrl,
}: Props) {
  return (
    <Image
      source={{
        uri:
          imageUrl ||
          "https://via.placeholder.com/600x400",
      }}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 20,
  },
});