import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../theme/colors";

type Props = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: "cover" | "contain" | "stretch";
  borderRadius?: number;
};

// Wraps RN's <Image> with a loading spinner while the image is
// fetching, and a broken-image icon if it fails — plain <Image> just
// renders blank/nothing in both cases, which looks like the app is
// broken (especially over a slow connection or when a product photo
// URL is stale/missing).
export default function RemoteImage({
  uri,
  style,
  resizeMode = "cover",
  borderRadius,
}: Props) {
  const [status, setStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  return (
    <View
      style={[
        styles.container,
        style,
        borderRadius !== undefined && { borderRadius },
      ]}
    >
      {status !== "error" && (
        <Image
          source={{ uri }}
          style={[
            StyleSheet.absoluteFill,
            borderRadius !== undefined && { borderRadius },
          ]}
          resizeMode={resizeMode}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}

      {status === "loading" && (
        <View style={styles.overlay}>
          <ActivityIndicator
            size="small"
            color={Colors.primary}
          />
        </View>
      )}

      {status === "error" && (
        <View style={styles.overlay}>
          <Ionicons
            name="image-outline"
            size={28}
            color={Colors.textSecondary}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
