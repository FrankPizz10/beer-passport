import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CommonNavButtonProps } from "../props";
import { useNavigation } from "@react-navigation/core";
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
        <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
          Confirm Delete
        </Text>
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
    backgroundColor: "red",
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
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
});

export default DeleteAccountButton;
