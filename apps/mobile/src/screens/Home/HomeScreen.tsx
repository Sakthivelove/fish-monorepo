import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import HomeHeader from "../../components/Home/HomeHeader";
import Banner from "../../components/Home/Banner/Banner";
import CategoryList from "../../components/Home/CategoryList/CategoryList";
import ProductSection from "../../components/Home/ProductSection/ProductSection";
import SearchBar from "../../components/Home/Search/SearchBar";

import { useProducts } from "../../hooks/useProducts";
import { HomeScreenProps } from "../../navigation/types";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function HomeScreen({
  navigation,
}: HomeScreenProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts();

  const categories = useMemo(() => {
    const distinct = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();

    return ["All", ...distinct];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (
        product.name ?? ""
      )
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : product.category ===
            selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <Banner />

        <SearchBar
          value={search}
          onChangeText={setSearch}
        />

        <CategoryList
          categories={categories}
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
        />

        <ProductSection
          title="Today's Fresh Catch"
          products={filteredProducts.slice(
            0,
            6
          )}
          onViewAll={() =>
            navigation.navigate(
              "ProductList"
            )
          }
          onProductPress={(
            productId
          ) =>
            navigation.navigate(
              "ProductDetails",
              {
                productId,
              }
            )
          }
        />

        <ProductSection
          title="Popular Products"
          products={filteredProducts.slice(
            6,
            12
          )}
          onViewAll={() =>
            navigation.navigate(
              "ProductList"
            )
          }
          onProductPress={(
            productId
          ) =>
            navigation.navigate(
              "ProductDetails",
              {
                productId,
              }
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});