import { StyleSheet } from "react-native";
import { MainButtonColor } from "./colors";

export const standardStyles = StyleSheet.create({
  basicCard: {
    backgroundColor: MainButtonColor,
    padding: 10,
    margin: 10,
    height: 60,
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  basicCardText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
