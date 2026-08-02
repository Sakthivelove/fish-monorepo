import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "../../theme/colors";

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const selected =
          item === selectedCategory;

        return (
          <Pressable
            style={[
              styles.chip,
              selected && styles.selectedChip,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.text,
                selected && styles.selectedText,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    height: 60,
    flexGrow: 0,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  chip: {
    height: 40,
    minWidth: 56,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedChip: {
    backgroundColor: Colors.primary,
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
  },

  selectedText: {
    color: "#fff",
  },
});