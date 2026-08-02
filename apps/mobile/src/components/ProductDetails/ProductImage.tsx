import React from "react";
import { StyleSheet } from "react-native";

import RemoteImage from "../RemoteImage";

type Props = {
  imageUrl: string;
};

export default function ProductImage({
  imageUrl,
}: Props) {
  return (
    <RemoteImage
      uri={imageUrl}
      style={styles.image}
      borderRadius={12}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 240,
    marginBottom: 20,
  },
});
