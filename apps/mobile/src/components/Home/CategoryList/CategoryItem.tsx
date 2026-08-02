import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "../../../theme/colors";

type Props = {
  title: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
};

export default function CategoryItem({
  title,
  emoji,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.selected,
      ]}
    >
      <Text style={styles.emoji}>
        {emoji}
      </Text>

      <Text
        style={[
          styles.title,
          selected && styles.titleSelected,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // Fixed width, but NOT a fixed height — a fixed height combined
    // with wrapping text is what was clipping longer category names
    // (e.g. "Shellfish"). minHeight + paddingVertical lets the box
    // grow instead of cutting text off.
    width: 84,
    minHeight: 84,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginRight: 12,
  },

  selected: {
    backgroundColor: Colors.primary,
  },

  emoji: {
    fontSize: 26,
    lineHeight: 30,
  },

  title: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },

  titleSelected: {
    color: "#fff",
  },
});
