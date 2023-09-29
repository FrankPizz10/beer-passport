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
import { ButtonColor, TitleColor } from "./colors";
import DeleteAccountButton from "./DeleteAccountButton";

const HomeScreen = (props: HomeProps) => {
  const [user, setUser] = useState({} as User);
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryScreen = () => {
    navigation.navigate("Category");
  };

  const handleYourBeersScreen = () => {
    navigation.navigate("YourBeers");
  };

  const handleSearchScreen = () => {
    navigation.navigate("SearchBeers");
  };

  const handleBadgesScreen = () => {
    navigation.navigate("YourBadges");
  };

  const handleCollectionsScreen = () => {
    navigation.navigate("AllCollections");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        const url = `${API_URL}/api/userbyuid/${uid}`;
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
        console.log("cur_user", cur_user);
        setUser(cur_user);
      } catch (error) {
        console.log("GetUserError", error);
      }
    };
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.welcome}>Welcome {user.user_name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSearchScreen} style={styles.button}>
          <Text style={styles.buttonText}>Search Beers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCategoryScreen} style={styles.button}>
          <Text style={styles.buttonText}>Find Beer By Category</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleYourBeersScreen} style={styles.button}>
          <Text style={styles.buttonText}>My Beers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBadgesScreen} style={styles.button}>
          <Text style={styles.buttonText}>My Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCollectionsScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Collections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Friends");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>My Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
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
    backgroundColor: "white",
    alignItems: "center",
  },
  titleContainer: {
    height: 100,
    width: 400,
    alignItems: "center",
    margin: 15,
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
