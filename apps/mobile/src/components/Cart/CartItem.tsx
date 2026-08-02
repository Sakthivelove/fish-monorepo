import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";

import { CartItem as CartItemType } from "../../context/CartContext";
import Colors from "../../theme/colors";
import { useCart } from "../../context/CartContext";



type Props = {
    item: CartItemType;
};

export default function CartItem({ item }: Props) {
    const {
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCart();
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.name}>
                    {item.name}
                </Text>

                <Text style={styles.price}>
                    ₹ {item.pricePerKg} / Kg
                </Text>

                <Text style={styles.cutting}>
                    {item.cuttingOption}
                </Text>

                <View style={styles.quantityRow}>
                    <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => decreaseQuantity(item.productId)}
                    >
                        <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>
                        {item.quantity}
                    </Text>

                    <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => increaseQuantity(item.productId)}
                    >
                        <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => removeFromCart(item.productId)}
                >
                    <Text style={styles.remove}>
                        Remove
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
    },

    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },

    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },

    name: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.text,
    },

    price: {
        fontSize: 16,
        color: Colors.success,
        fontWeight: "600",
    },

    cutting: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    qtyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    qtyButtonText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },

    quantity: {
        marginHorizontal: 16,
        fontSize: 18,
        fontWeight: "600",
    },

    remove: {
        marginTop: 10,
        color: Colors.error,
        fontWeight: "600",
    },
});