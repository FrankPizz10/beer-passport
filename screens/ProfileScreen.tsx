import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { BackgroundColor, MainButtonColor } from "../Styles/colors";
import { ProfileProps } from "../props";
import { useNavigation } from "@react-navigation/core";

const ProfileScreen = (props: ProfileProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleAccount = () => {
    navigation.navigate("Account");
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Screen</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("YourBeers");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>My Beers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("YourBadges");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>My Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Friends");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>My Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAccount} style={styles.button}>
          <Text style={styles.buttonText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  title: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: MainButtonColor,
    color: "white",
    height: Dimensions.get("window").height / 12,
    padding: 10,
    margin: 10,
    width: Dimensions.get("window").width - 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
  },
});
