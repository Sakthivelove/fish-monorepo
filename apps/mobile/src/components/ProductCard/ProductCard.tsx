import { Pressable, Text, View } from "react-native";
import { Product } from "../../services/product.service";
import { styles } from "./ProductCard.styles";
import RemoteImage from "../RemoteImage";

type Props = {
  product: Product;
  onPress?: () => void;
  // "vertical" (default): full-width card for a single-column list
  // (ProductListScreen). "horizontal": fixed-width card for a
  // horizontal-scrolling row (Home screen sections) — without an
  // explicit width here, the Image's width:"100%" has nothing to
  // size against inside a horizontal FlatList and collapses, which
  // is what was making cards visually overlap/stick together.
  variant?: "vertical" | "horizontal";
};

export default function ProductCard({
  product,
  onPress,
  variant = "vertical",
}: Props) {
  const isHorizontal = variant === "horizontal";

  return (
    <Pressable
      style={[
        styles.card,
        isHorizontal && styles.cardHorizontal,
      ]}
      onPress={onPress}
    >
      <RemoteImage
        uri={product.imageUrl}
        style={[
          styles.image,
          isHorizontal && styles.imageHorizontal,
        ]}
        borderRadius={10}
      />

      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>

      <Text style={styles.tamilName} numberOfLines={1}>
        {product.tamilName}
      </Text>

      <Text style={styles.price}>
        ₹ {product.pricePerKg} / Kg
      </Text>

      {!isHorizontal && (
        <>
          <Text style={styles.category}>
            Category : {product.category}
          </Text>

          <Text style={styles.stock}>
            Stock : {product.stockQuantityGrams / 1000} Kg
          </Text>
        </>
      )}
    </Pressable>
  );
}