import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddressForm, AddressFormValues } from "../../components/Checkout";
import PrimaryButton from "../../components/PrimaryButton";
import { useProfile } from "../../hooks/useProfile";
import Colors from "../../theme/colors";
import { registerForPushNotifications, registerForPushNotificationsDebug } from "../../utils/registerForPushNotifications";

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

        if (form.phoneNumber.trim().length >= 10) {
            registerForPushNotifications(form.phoneNumber);
        }

        Alert.alert("Saved", "Your details have been saved.");
    }

    async function handleTestPushRegistration() {
        if (form.phoneNumber.trim().length < 10) {
            Alert.alert(
                "Phone number needed",
                "Enter and save a valid phone number first."
            );
            return;
        }

        const result = await registerForPushNotificationsDebug(
            form.phoneNumber
        );

        if (result.success) {
            Alert.alert(
                "Push notifications ready",
                "This device registered successfully. Order status updates will be pushed here."
            );
        } else {
            Alert.alert(
                "Not registered",
                result.reason
            );
        }
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

                <View style={styles.saveButtonWrapper}>
                    <PrimaryButton
                        title="Save"
                        onPress={handleSave}
                    />
                </View>

                <View style={styles.testButtonWrapper}>
                    <PrimaryButton
                        title="Test Push Notifications"
                        onPress={handleTestPushRegistration}
                    />
                </View>
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
        paddingBottom: 40,
    },

    saveButtonWrapper: {
        marginTop: 24,
    },

    testButtonWrapper: {
        marginTop: 12,
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
