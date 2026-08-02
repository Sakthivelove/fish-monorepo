import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  tamilName: {
    fontSize: 15,
    color: "#666",
    marginTop: 2,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A8F08",
    marginTop: 10,
  },

  category: {
    marginTop: 8,
    color: "#444",
  },

  stock: {
    marginTop: 4,
    color: "#444",
  },
});