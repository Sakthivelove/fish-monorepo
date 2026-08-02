import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

import { AddressForm, AddressFormValues } from "../../components/Checkout";
import PrimaryButton from "../../components/PrimaryButton";
import { useProfile } from "../../hooks/useProfile";
import Colors from "../../theme/colors";

export default function ProfileScreen() {
    const { profile, updateProfile, loading } = useProfile();

    const [form, setForm] = useState<AddressFormValues>({
        name: "",
        phoneNumber: "",
        email: "",
        deliveryAddress: "",
        pincode: "",
    });

    useEffect(() => {
        if (!loading) {
            setForm({
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                email: profile.email,
                deliveryAddress: profile.deliveryAddress,
                pincode: profile.pincode,
            });
        }
    }, [loading]);

    async function handleSave() {
        await updateProfile(form);
        Alert.alert("Saved", "Your details have been saved.");
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>My Details</Text>

                <Text style={styles.subtitle}>
                    Saved here so we can prefill your checkout
                    form and look up your orders.
                </Text>

                <AddressForm values={form} onChange={setForm} />

                <PrimaryButton
                    title="Save"
                    onPress={handleSave}
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

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: Colors.text,
    },

    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 6,
        marginBottom: 8,
    },
});
