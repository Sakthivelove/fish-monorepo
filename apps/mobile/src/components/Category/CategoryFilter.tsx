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
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 10,
  },

  selectedChip: {
    backgroundColor: Colors.primary,
  },

  text: {
    fontWeight: "600",
  },

  selectedText: {
    color: "#fff",
  },
});