import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { HomeProps } from "../props";
import { User } from "../Models/SQLData";
import { API_URL } from "@env";
import { BackgroundColor, ButtonColor, TitleColor } from "./colors";
import { Ionicons } from "@expo/vector-icons";
import DeleteAccountButton from "./DeleteAccountButton";

const HomeScreen = (props: HomeProps) => {
  const [user, setUser] = useState({} as User);
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [badgeCount, setBadgeCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);

  const handleCategoryScreen = () => {
    navigation.navigate("Category");
  };

  const handleCollectionsScreen = () => {
    navigation.navigate("AllCollections");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${API_URL}/api/userbyuid`;
        async function getUserHelper(): Promise<User> {
          const token = await auth.currentUser?.getIdToken();
          const response = await fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const cur_user = await response.json();
          return cur_user;
        }
        const cur_user = await getUserHelper();
        setUser(cur_user);
      } catch (error) {
        console.log("GetUserError", error);
      }
    };
    getUser();
    const getBadgeCount = async () => {
      try {
        const url = `${API_URL}/api/userbadges/count`;
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
        const url = `${API_URL}/api/userbeers/count`;
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
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.welcome}>Welcome {user.user_name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="ios-beer" size={30} color="blue" />
      </View>
      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetails}>
          You have completed {badgeCount}{" "}
          {badgeCount === 1 ? "badge" : "badges"}!
        </Text>
        <Text style={styles.userDetails}>
          You have tried {triedCount} {triedCount === 1 ? "beer" : "beers"}!
        </Text>
        <Text style={styles.userDetails}>
          You have liked {likedCount} {likedCount === 1 ? "beer" : "beers"}!
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCategoryScreen} style={styles.button}>
          <Text style={styles.buttonText}>Find Beer By Category</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCollectionsScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Collections</Text>
        </TouchableOpacity>
        {/* <View>
          <DeleteAccountButton navigation={navigation} user_id={user.id} />
        </View> */}
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
    width: 400,
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    color: TitleColor,
  },
  welcome: {
    fontSize: 30,
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
    fontSize: 20,
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
    height: 400,
    width: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: ButtonColor,
    color: "white",
    height: 50,
    padding: 10,
    margin: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
