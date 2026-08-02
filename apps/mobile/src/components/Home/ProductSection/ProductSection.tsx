import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ProductCard from "../../ProductCard";
import SectionHeader from "./SectionHeader";

import { Product } from "../../../services/product.service";

type Props = {
  title: string;
  products: Product[];
  onViewAll: () => void;
  onProductPress: (productId: string) => void;
};

export default function ProductSection({
  title,
  products,
  onViewAll,
  onProductPress,
}: Props) {
  return (
    <View style={styles.container}>
      <SectionHeader
        title={title}
        onViewAll={onViewAll}
      />

      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              onProductPress(item.id)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },

  list: {
    paddingHorizontal: 20,
  },
});