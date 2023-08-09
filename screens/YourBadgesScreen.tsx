import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { YourBadgesProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { decimalToPercent } from "../utils";

const YourBadgesScreen = (props: YourBadgesProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const userBadges = useYourBadges(props.route.params.user_id);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}> Your Badges </Text>
        <ScrollView>
          {userBadges?.map((badge) => {
            return (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeTitle}>
                  {badge.collections.name.toUpperCase()}
                </Text>
                <Text>{badge.collections.description}</Text>
                <Text>Difficulty: {badge.collections.difficulty}</Text>
                <Text>Progress: {decimalToPercent(badge.progress)}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default YourBadgesScreen;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 50,
    fontWeight: "bold",
  },
  badgeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#b266b2",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  dropDown: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  beerCard: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#ff5722", // Choose your desired background color
    borderRadius: 12, // Adjust the border radius to change the shape
  },
});
