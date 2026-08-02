import React from "react";
import {
  FlatList,
  StyleSheet,
} from "react-native";

import CategoryItem from "./CategoryItem";
import { getCategoryEmoji } from "../../../constants/categories";

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (
    category: string
  ) => void;
};

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <CategoryItem
          title={item}
          emoji={getCategoryEmoji(item)}
          selected={
            selectedCategory === item
          }
          onPress={() =>
            onSelectCategory(item)
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    height: 104,
    flexGrow: 0,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
