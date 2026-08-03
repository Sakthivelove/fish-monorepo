import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import Colors from "../../theme/colors";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search fish..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});