import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { HomeProps } from "../props";
import { User } from "../Models/SQLData";
import { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_EXPO_PROJECT_ID } from "@env";
import { BackgroundColor, MainButtonColor, TitleColor } from "../Styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { isUser } from "../utils";

export const getUser = async (): Promise<User | undefined> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/userbyuid`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const cur_user = await response.json();
    if (!isUser(cur_user)) {
      return undefined;
    }
    return cur_user;
  } catch (error) {
    console.log("GetUserError", error);
  }
};

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return;
    }
  }
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: EXPO_PUBLIC_EXPO_PROJECT_ID,
    })
  ).data;
  return token;
}

const sendPushTokenToServer = async (notificationToken: string) => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/notification-token`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ pushToken: notificationToken }),
    });
    await response.json();
  } catch (error) {
    console.log("SendPushTokenToServerError", error);
  }
};

const HomeScreen = (props: HomeProps) => {
  const [user, setUser] = useState({} as User | undefined);
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [badgeCount, setBadgeCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);

  // const handleCategoryScreen = () => {
  //   navigation.navigate("Category");
  // };

  const handleCollectionsScreen = () => {
    navigation.navigate("AllCollections");
  };

  useEffect(() => {
    const getUserData = async () => {
      const cur_user = await getUser();
      setUser(cur_user);
    };
    getUserData();
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) sendPushTokenToServer(token);
      })
      .catch((error) => console.error("Error obtaining push token:", error));
  }, []);

  useFocusEffect(() => {
    const getBadgeCount = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/userbadges/completedcount`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const { badgeCount } = await response.json();
        setBadgeCount(badgeCount);
      } catch (error) {
        console.log("GetBadgeCountError", error);
      }
    };
    getBadgeCount();
    const getLikedAndTriedBeersCount = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/count`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const { likedBeersCount, triedBeersCount } = await response.json();
        setLikedCount(likedBeersCount);
        setTriedCount(triedBeersCount);
      } catch (error) {
        console.log("GetLikedAndTriedBeersCountError", error);
      }
    };
    getLikedAndTriedBeersCount();
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.welcome} maxFontSizeMultiplier={1.1}>
          Welcome {user!.user_name}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="beer-outline" size={80} color="gold" />
      </View>
      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
          You have completed {badgeCount}{" "}
          {badgeCount === 1 ? "badge" : "badges"}!
        </Text>
        <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
          You have tried {triedCount} {triedCount === 1 ? "beer" : "beers"}!
        </Text>
        <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
          You have liked {likedCount} {likedCount === 1 ? "beer" : "beers"}!
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity onPress={handleCategoryScreen} style={styles.button}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Find Beer By Category
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={handleCollectionsScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Collections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("YourBadges");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.5}>
            My Badges
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  welcome: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
    color: TitleColor,
    paddingTop: 10,
  },
  userDetailsContainer: {
    alignItems: "center",
    padding: 15,
  },
  userDetails: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
