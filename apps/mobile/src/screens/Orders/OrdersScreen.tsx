import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useOrdersByPhone } from "../../hooks/useOrders";
import { useProfile } from "../../hooks/useProfile";
import { Order } from "../../services/order.service";
import { OrdersScreenProps } from "../../navigation/types";
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

function OrderCard({
    order,
    onPress,
}: {
    order: Order;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>
                    #{order.id.slice(0, 8)}
                </Text>

                <Text style={styles.status}>
                    {STATUS_LABELS[order.status] ?? order.status}
                </Text>
            </View>

            <Text style={styles.meta}>
                {new Date(order.createdAt).toLocaleDateString()}
                {"  ·  "}
                {order.paymentMethod}
                {"  ·  "}
                {order.paymentStatus}
            </Text>

            <Text style={styles.total}>
                ₹ {order.totalAmount}
            </Text>
        </TouchableOpacity>
    );
}

export default function OrdersScreen({
    navigation,
}: OrdersScreenProps) {
    const { profile, loading: profileLoading } = useProfile();

    const [phone, setPhone] = useState("");

    // Prefill with the saved profile's phone number, if any.
    useEffect(() => {
        if (!profileLoading && profile.phoneNumber) {
            setPhone(profile.phoneNumber);
        }
    }, [profileLoading]);

    const {
        data: orders,
        isLoading,
        isError,
        error,
        isFetching,
    } = useOrdersByPhone(phone);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My Orders</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            {phone.trim().length < 10 && (
                <Text style={styles.hint}>
                    Enter the phone number used while ordering to
                    see your orders.
                </Text>
            )}

            {phone.trim().length >= 10 && (isLoading || isFetching) && (
                <ActivityIndicator
                    size="large"
                    style={styles.loader}
                />
            )}

            {phone.trim().length >= 10 && isError && (
                <Text style={styles.hint}>
                    {getErrorMessage(error)}
                </Text>
            )}

            {phone.trim().length >= 10 &&
                !isLoading &&
                !isError &&
                orders?.length === 0 && (
                    <Text style={styles.hint}>
                        No orders found for this number.
                    </Text>
                )}

            <FlatList
                data={orders ?? []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() =>
                            navigation.navigate(
                                "OrderDetails",
                                { orderId: item.id }
                            )
                        }
                    />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 16,
    },

    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },

    hint: {
        marginTop: 16,
        color: Colors.textSecondary,
        fontSize: 14,
    },

    loader: {
        marginTop: 24,
    },

    list: {
        paddingTop: 16,
        paddingBottom: 24,
    },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    orderId: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
    },

    status: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
    },

    meta: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 4,
    },

    total: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.success,
        marginTop: 8,
    },
});
