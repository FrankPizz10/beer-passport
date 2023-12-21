import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CommonNavButtonProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { ButtonColor } from "./colors";
import { deleteAccount } from "../Models/Requests";

const DeleteAccountButton = (props: CommonNavButtonProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Confirm Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: ButtonColor,
    color: "white",
    height: 50,
    padding: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DeleteAccountButton;
