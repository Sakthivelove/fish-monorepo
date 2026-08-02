import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Colors from "../../theme/colors";

export type AddressFormValues = {
  name: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
  pincode: string;
};

type Props = {
  values: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
};

export default function AddressForm({
  values,
  onChange,
}: Props) {
  function set<K extends keyof AddressFormValues>(
    key: K,
    value: AddressFormValues[K]
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <View>
      <Text style={styles.label}>Name</Text>

      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={values.name}
        onChangeText={(text) => set("name", text)}
      />

      <Text style={styles.label}>Phone</Text>

      <TextInput
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        style={styles.input}
        value={values.phoneNumber}
        onChangeText={(text) => set("phoneNumber", text)}
      />

      <Text style={styles.label}>Email (optional)</Text>

      <TextInput
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={values.email}
        onChangeText={(text) => set("email", text)}
      />

      <Text style={styles.label}>Address</Text>

      <TextInput
        placeholder="Enter delivery address"
        multiline
        style={[
          styles.input,
          styles.addressInput,
        ]}
        value={values.deliveryAddress}
        onChangeText={(text) =>
          set("deliveryAddress", text)
        }
      />

      <Text style={styles.label}>Pincode</Text>

      <TextInput
        placeholder="6-digit pincode"
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        value={values.pincode}
        onChangeText={(text) => set("pincode", text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: Colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
