import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { CommonNavButtonProps } from "../props";

const AddFriendsButton = (props: CommonNavButtonProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleFriendScreen = () => {
    navigation.navigate("AddFriends", { user_id: props.user_id });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFriendScreen}>
        <Text style={styles.text}>Add Friends</Text>
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
    alignItems: "center",
    backgroundColor: "#3399FF",
    borderRadius: 5,
    padding: 10,
    width: 150,
    marginTop: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AddFriendsButton;
