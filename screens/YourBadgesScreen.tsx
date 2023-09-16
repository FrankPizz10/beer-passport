import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { YourBadgesProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { decimalToPercent } from "../utils";
import HomeButton from "./HomeButton";

const YourBadgesScreen = (props: YourBadgesProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const userBadges = useYourBadges();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.HomeButton}>
        <HomeButton route={props.route} navigation={props.navigation} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}> My Badges </Text>
      </View>
      <ScrollView style={styles.badgeContainer}>
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
        {userBadges?.length === 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTitle}>You have no badges yet!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default YourBadgesScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  pageTitle: {
    fontSize: 50,
    fontWeight: "bold",
  },
  badgeContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignContent: "center",
  },
  badgeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5722",
    borderRadius: 12,
    margin: 5,
    width: 350,
    height: 150,
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
