import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DeleteAccountButton from "./DeleteAccountButton";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { AccountProps } from "../props";
import { BackgroundColor, ButtonColor, TitleColor } from "./colors";

const AccountScreen = (props: AccountProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Account Screen</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        {!deleteAccount && (
          <TouchableOpacity
            onPress={() => setDeleteAccount(!deleteAccount)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        )}
        {deleteAccount && (
          <View>
            <Text style={styles.deleteAccountText}>
              Are you sure you want to delete your account?
            </Text>
            <DeleteAccountButton navigation={navigation} />
          </View>
        )}
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    width: 400,
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    color: TitleColor,
  },
  buttonContainer: {
    alignItems: "center",
    height: 200,
    width: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: ButtonColor,
    color: "white",
    height: 50,
    padding: 10,
    margin: 10,
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
  deleteAccountText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: 300,
    marginTop: 20,
  },
});
