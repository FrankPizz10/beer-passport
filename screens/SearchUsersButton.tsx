import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { CommonNavButtonProps } from "../props";
import { MainHighlightColor } from "../Styles/colors";

const SearchUsersButton = (props: CommonNavButtonProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleFriendScreen = () => {
    navigation.navigate("SearchUsers");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFriendScreen}>
      <Text style={styles.text} maxFontSizeMultiplier={1.2}>
        Search Users
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: MainHighlightColor,
    borderRadius: 5,
    padding: 10,
    width: Dimensions.get("window").width / 2,
    margin: 10,
  },
  text: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default SearchUsersButton;
