import React from "react";
import {
  FlatList,
  StyleSheet,
} from "react-native";

import CategoryItem from "./CategoryItem";
import { CATEGORIES } from "../../../constants/categories";

type Props = {
  selectedCategory: string;
  onSelectCategory: (
    category: string
  ) => void;
};

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <FlatList
      horizontal
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <CategoryItem
          title={item.name}
          emoji={item.emoji}
          selected={
            selectedCategory === item.name
          }

          onPress={() =>
            onSelectCategory(item.name)
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});