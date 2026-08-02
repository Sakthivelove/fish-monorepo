import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import PrimaryButton from "../../components/PrimaryButton";
import { useCancelOrder, useOrderDetails } from "../../hooks/useOrders";
import { OrderDetailsScreenProps } from "../../navigation/types";
import Colors from "../../theme/colors";
import { getErrorMessage } from "../../utils/getErrorMessage";

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CUTTING: "Cutting",
    PACKING: "Packing",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

// Mirrors the backend rule: a customer can only cancel while the
// order hasn't started being prepared yet.
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED"];

export default function OrderDetailsScreen({
    route,
    navigation,
}: OrderDetailsScreenProps) {
    const { orderId } = route.params;

    const {
        data: order,
        isLoading,
        isError,
        error,
        refetch,
    } = useOrderDetails(orderId);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );


    const cancelOrder = useCancelOrder(orderId);
    const [cancelling, setCancelling] = useState(false);

    function handleCancel() {
        Alert.alert(
            "Cancel Order?",
            "Are you sure you want to cancel this order?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setCancelling(true);
                            await cancelOrder.mutateAsync(undefined);
                            Alert.alert(
                                "Order Cancelled",
                                "Your order has been cancelled."
                            );
                        } catch (err) {
                            Alert.alert(
                                "Couldn't Cancel",
                                getErrorMessage(err)
                            );
                        } finally {
                            setCancelling(false);
                        }
                    },
                },
            ]
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (isError || !order) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>{getErrorMessage(error)}</Text>
            </SafeAreaView>
        );
    }

    const canCancel = CANCELLABLE_STATUSES.includes(
        order.status
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>
                    Order #{order.id.slice(0, 8)}
                </Text>

                <View style={styles.statusRow}>
                    <Text style={styles.status}>
                        {STATUS_LABELS[order.status] ??
                            order.status}
                    </Text>

                    <Text style={styles.date}>
                        {new Date(
                            order.createdAt
                        ).toLocaleString()}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Items</Text>

                {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemName}>
                                {item.product.name ||
                                    item.product.tamilName}
                            </Text>

                            <Text style={styles.itemMeta}>
                                {(item.quantityGrams / 1000).toFixed(
                                    2
                                )}{" "}
                                Kg
                                {item.cuttingOption
                                    ? ` · ${item.cuttingOption}`
                                    : ""}
                            </Text>
                        </View>

                        <Text style={styles.itemSubtotal}>
                            ₹ {item.subtotal}
                        </Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>
                    Delivery Address
                </Text>

                <Text style={styles.text}>
                    {order.deliveryAddress}
                </Text>

                <Text style={styles.text}>
                    Pincode: {order.pincode}
                </Text>

                <Text style={styles.sectionTitle}>Payment</Text>

                <Text style={styles.text}>
                    {order.paymentMethod} · {order.paymentStatus}
                </Text>

                {order.transactionId && (
                    <Text style={styles.text}>
                        Transaction ID: {order.transactionId}
                    </Text>
                )}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        ₹ {order.totalAmount}
                    </Text>
                </View>

                {canCancel && (
                    <PrimaryButton
                        title={
                            cancelling
                                ? "Cancelling..."
                                : "Cancel Order"
                        }
                        onPress={handleCancel}
                        disabled={cancelling}
                    />
                )}
            </ScrollView>
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
        backgroundColor: Colors.background,
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.text,
    },

    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 20,
    },

    status: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.primary,
    },

    date: {
        fontSize: 13,
        color: Colors.textSecondary,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.text,
        marginTop: 20,
        marginBottom: 10,
    },

    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },

    itemLeft: {
        flex: 1,
        paddingRight: 12,
    },

    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
    },

    itemMeta: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    itemSubtotal: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
    },

    text: {
        fontSize: 15,
        color: Colors.text,
        marginBottom: 4,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginBottom: 24,
    },

    totalLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },

    totalValue: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.success,
    },
});
