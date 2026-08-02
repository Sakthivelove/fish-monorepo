import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useCart, CartItem as CartItemType } from "../../context/CartContext";
import CartItem from "../../components/Cart/CartItem";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Colors from "../../theme/colors";
import { CartScreenProps } from "../../navigation/types";

export default function CartScreen({
    navigation,
}: CartScreenProps) {
    const { cart, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Ionicons
                        name="cart-outline"
                        size={72}
                        color={Colors.border}
                    />

                    <Text style={styles.emptyTitle}>
                        Your cart is empty
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Browse the catch of the day and add
                        something fresh.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Cart</Text>
                <Text style={styles.itemCount}>
                    {cart.length}{" "}
                    {cart.length === 1 ? "item" : "items"}
                </Text>
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }: { item: CartItemType }) => (
                    <CartItem item={item} />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>
                        Total
                    </Text>
                    <Text style={styles.total}>
                        ₹ {totalPrice}
                    </Text>
                </View>

                <PrimaryButton
                    title="Checkout"
                    onPress={() => {
                        navigation.navigate("Checkout");
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.text,
        marginTop: 16,
    },

    emptySubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center",
        marginTop: 8,
    },

    header: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: Colors.text,
    },

    itemCount: {
        fontSize: 14,
        color: Colors.textSecondary,
    },

    list: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: Colors.background,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },

    totalLabel: {
        fontSize: 16,
        color: Colors.textSecondary,
    },

    total: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.text,
    },
});
