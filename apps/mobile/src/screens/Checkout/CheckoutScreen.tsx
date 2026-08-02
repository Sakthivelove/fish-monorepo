import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";

import {
    AddressForm,
    AddressFormValues,
    OrderSummary,
    PaymentMethodSelector,
    PlaceOrderButton,
    PriceDetails,
} from "../../components/Checkout";
import { PaymentMethod } from "../../components/Checkout/PaymentMethodSelector";

import { useCart } from "../../context/CartContext";
import { useProfile } from "../../hooks/useProfile";
import { useCreateOrder } from "../../hooks/useOrders";
import { CheckoutScreenProps } from "../../navigation/types";
import Colors from "../../theme/colors";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function CheckoutScreen({
    navigation,
}: CheckoutScreenProps) {
    const { cart, totalPrice, clearCart } = useCart();
    const { profile, updateProfile, loading: profileLoading } =
        useProfile();

    const createOrder = useCreateOrder();

    const [form, setForm] = useState<AddressFormValues>({
        name: "",
        phoneNumber: "",
        email: "",
        deliveryAddress: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("COD");

    const [transactionId, setTransactionId] = useState("");

    // Prefill the form once the saved profile has loaded.
    useEffect(() => {
        if (!profileLoading) {
            setForm({
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                email: profile.email,
                deliveryAddress: profile.deliveryAddress,
                pincode: profile.pincode,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileLoading]);

    function validate(): string | null {
        if (cart.length === 0) {
            return "Your cart is empty.";
        }
        if (!form.name.trim()) {
            return "Please enter your name.";
        }
        if (form.phoneNumber.trim().length < 10) {
            return "Please enter a valid phone number.";
        }
        if (
            form.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {
            return "Please enter a valid email address, or leave it blank.";
        }
        if (!form.deliveryAddress.trim()) {
            return "Please enter a delivery address.";
        }
        if (form.deliveryAddress.trim().length < 10) {
            return "Delivery address must be at least 10 characters.";
        }
        if (!/^\d{6}$/.test(form.pincode.trim())) {
            return "Please enter a valid 6-digit pincode.";
        }
        if (
            paymentMethod === "UPI" &&
            !transactionId.trim()
        ) {
            return "Please enter the UPI transaction ID.";
        }
        return null;
    }

    async function handlePlaceOrder() {
        const validationError = validate();

        if (validationError) {
            Alert.alert("Check your details", validationError);
            return;
        }

        try {
            const order = await createOrder.mutateAsync({
                customer: {
                    name: form.name.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    email: form.email.trim() || undefined,
                },
                deliveryAddress: form.deliveryAddress.trim(),
                pincode: form.pincode.trim(),
                paymentMethod,
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantityGrams: Math.round(
                        item.quantity * 1000
                    ),
                    cuttingOption: item.cuttingOption,
                })),
                transactionId:
                    paymentMethod === "UPI"
                        ? transactionId.trim()
                        : null,
            });

            // Remember the customer's details locally for next time.
            await updateProfile(form);

            clearCart();

            Alert.alert(
                "Order Placed!",
                `Your order #${order.id.slice(0, 8)} has been placed.`,
                [
                    {
                        text: "View Orders",
                        onPress: () =>
                            navigation.navigate("MainTabs", {
                                screen: "Orders",
                            }),
                    },
                ]
            );
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Order Failed",
                getErrorMessage(error)
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <Text style={styles.sectionTitle}>
                    Delivery Address
                </Text>

                <AddressForm
                    values={form}
                    onChange={setForm}
                />

                <Text style={styles.sectionTitle}>
                    Payment Method
                </Text>

                <PaymentMethodSelector
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                />

                {paymentMethod === "UPI" && (
                    <TextInput
                        style={styles.input}
                        placeholder="UPI Transaction ID"
                        value={transactionId}
                        onChangeText={setTransactionId}
                    />
                )}

                <Text style={styles.sectionTitle}>
                    Order Summary
                </Text>

                <OrderSummary items={cart} />

                <Text style={styles.sectionTitle}>
                    Price Details
                </Text>

                <PriceDetails itemsTotal={totalPrice} />

                <PlaceOrderButton
                    onPress={handlePlaceOrder}
                    loading={createOrder.isPending}
                    disabled={cart.length === 0}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginTop: -4,
        marginBottom: 8,
    },
});
