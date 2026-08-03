import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/RootNavigator";
import { useProduct } from "../../hooks/useProducts";
import { useCart } from "../../context/CartContext";

import Colors from "../../theme/colors";
import { AddToCartSection, ProductInfo, ProductPrice, ProductImage, CuttingOptionSelector } from "../../components/ProductDetails";
import { ProductDetailsScreenProps } from "../../navigation/types";
import { DEFAULT_CUTTING_OPTION } from "../../constants/cuttingOptions";


export default function ProductDetailsScreen({
    navigation,
    route,
}: ProductDetailsScreenProps) {
  const { productId } = route.params;

  const { data: product, isLoading, isError } =
    useProduct(productId);

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const [cuttingOption, setCuttingOption] = useState(
    DEFAULT_CUTTING_OPTION
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text>Unable to load product.</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name ?? "",
      imageUrl: product.imageUrl,
      pricePerKg: product.pricePerKg,
      quantity,
      cuttingOption,
    });

    navigation.navigate("MainTabs", {
      screen: "Cart",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <ProductImage
          imageUrl={product.imageUrl}
        />

        <ProductInfo
          name={product.name ?? ""}
          tamilName={product.tamilName}
          category={product.category}
          stock={product.stockQuantityGrams}
          description={
            product.description ?? ""
          }
        />

        <ProductPrice
          price={product.pricePerKg}
        />

        <CuttingOptionSelector
          value={cuttingOption}
          onChange={setCuttingOption}
        />

        <AddToCartSection
          quantity={quantity}
          onIncrease={() =>
            setQuantity((q) => q + 1)
          }
          onDecrease={() =>
            setQuantity((q) =>
              q > 1 ? q - 1 : 1
            )
          }
          onAddToCart={handleAddToCart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  tamilName: {
    marginTop: 8,
    fontSize: 18,
    color: Colors.textSecondary,
  },

  price: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "700",
    color: Colors.success,
  },

  label: {
    marginTop: 14,
    fontSize: 17,
    color: Colors.text,
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 24,
  },
});