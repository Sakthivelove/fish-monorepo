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
    // Fixed size — numberOfLines={1} + adjustsFontSizeToFit on the
    // title already guarantee the text always fits in one line, so
    // this can be a true fixed height instead of minHeight. A
    // variable height here was letting individual chips render
    // taller/shorter than their neighbors, which made the whole
    // horizontal row appear to jump.
    width: 84,
    height: 84,
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
