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

      <Text style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 82,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  selected: {
    backgroundColor: Colors.primary,
  },

  emoji: {
    fontSize: 28,
  },

  title: {
    marginTop: 6,
    fontWeight: "600",
  },
});