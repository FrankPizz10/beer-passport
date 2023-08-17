import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouterProps } from "../props";
import { useNavigation } from "@react-navigation/core";

const HomeButton = (props: RouterProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.text}>Home</Text>
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
    width: 100,
    marginTop: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeButton;
