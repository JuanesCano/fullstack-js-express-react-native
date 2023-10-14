import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function FormSubmitButton({ title, submitting, onPress }) {
  const backgroundColor = "rgba(27, 27, 51, 0.4) ";

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={() => onPress()}
    >
      <Text style={{ fontSize: 18, color: "white" }}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
