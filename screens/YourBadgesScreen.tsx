import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { YourBadgesProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { decimalToPercent } from "../utils";
import { BackgroundColor, MainButtonColor } from "../Styles/colors";
import { standardStyles } from "../Styles/styles";
// import HomeButton from "./HomeButton";

const YourBadgesScreen = (props: YourBadgesProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const userBadges = useYourBadges();

  const handleBadgePress = (collectionId: number) => {
    navigation.navigate("Collection", {
      collection_id: collectionId,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* <View style={styles.HomeButton}>
        <HomeButton route={props.route} navigation={props.navigation} />
      </View> */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}> My Badges </Text>
      </View>
      <ScrollView style={styles.badgeContainer}>
        {userBadges?.map((badge) => {
          return (
            <TouchableOpacity
              key={badge.id}
              style={[
                styles.badge,
                badge.earned ? styles.goldenBadge : null
              ]}
              onPress={() => handleBadgePress(badge.collections.id)}
            >
              <Text style={styles.badgeTitle}>
                {badge.collections.name.toUpperCase()}
              </Text>
              <Text style={standardStyles.basicCardText}>{badge.collections.description}</Text>
              <Text style={standardStyles.basicCardText}>Difficulty: {badge.collections.difficulty}</Text>
              <Text style={standardStyles.basicCardText}>Progress: {decimalToPercent(badge.progress)}</Text>
            </TouchableOpacity>
          );
        })}
        {userBadges?.length === 0 && (
          <View style={styles.badge}>
            <Text style={styles.noBadgeTitle}>You have no badges yet!</Text>
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
    backgroundColor: BackgroundColor,
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
    fontSize: 35,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 10,
  },
  noBadgeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MainButtonColor,
    borderRadius: 12,
    margin: 5,
    width: 350,
    height: 160,
  },
  goldenBadge: {
    backgroundColor: "gold",
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
