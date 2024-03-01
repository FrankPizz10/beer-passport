import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { YourBadgesProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { BackgroundColor, MainButtonColor } from "../Styles/colors";
import Badge from "../components/Badge";

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
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle} maxFontSizeMultiplier={1.2}>
          {" "}
          My Badges{" "}
        </Text>
      </View>
      <ScrollView style={styles.badgeContainer}>
        {userBadges?.map((badge) => {
          return (
            <Badge
              key={badge.id}
              badge={badge}
              handleBadgePress={handleBadgePress}
            />
          );
        })}
        {userBadges?.length === 0 && (
          <View style={styles.badge}>
            <Text style={styles.noBadgeTitle} maxFontSizeMultiplier={1.2}>
              You have no badges yet!
            </Text>
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
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
  },
  badgeContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignContent: "center",
  },
  noBadgeTitle: {
    fontSize: Dimensions.get("window").width / 15,
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
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height / 5,
  },
});
