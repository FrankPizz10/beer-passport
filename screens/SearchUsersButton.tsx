import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { CommonNavButtonProps } from "../props";

const SearchUsersButton = (props: CommonNavButtonProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleFriendScreen = () => {
    navigation.navigate("AddFriends");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFriendScreen}>
      <Text style={styles.text}>Search Users</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#3399FF",
    borderRadius: 5,
    padding: 10,
    width: 150,
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SearchUsersButton;
