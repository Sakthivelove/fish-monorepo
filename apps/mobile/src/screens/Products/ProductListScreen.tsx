import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/Search/SearchBar";
import CategoryFilter from "../../components/Category/CategoryFilter";
import { ProductListScreenProps } from "../../navigation/types";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ProductListScreen({
  navigation,
}: ProductListScreenProps) {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const categories = useMemo(() => {
    const distinct = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();

    return ["All", ...distinct];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        (product.name ?? "").toLowerCase().includes(query) ||
        (product.tamilName ?? "").includes(search.trim()) ||
        (product.category ?? "").includes(search.trim());

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{getErrorMessage(error)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("ProductDetails", {
                productId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search || selectedCategory !== "All"
              ? "No products match your search/filter."
              : "No products available."}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});