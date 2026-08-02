import { Image, Pressable, Text, View } from "react-native";
import { Product } from "../../services/product.service";
import { styles } from "./ProductCard.styles";

type Props = {
  product: Product;
  onPress?: () => void;
};

export default function ProductCard({
  product,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{
          uri: product.imageUrl,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>
        {product.name}
      </Text>

      <Text style={styles.tamilName}>
        {product.tamilName}
      </Text>

      <Text style={styles.price}>
        ₹ {product.pricePerKg} / Kg
      </Text>

      <Text style={styles.category}>
        Category : {product.category}
      </Text>

      <Text style={styles.stock}>
        Stock : {product.stockQuantityGrams / 1000} Kg
      </Text>
    </Pressable>
  );
}