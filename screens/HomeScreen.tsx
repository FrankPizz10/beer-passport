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
    navigation.navigate("Category", { user_id: user.id });
  };

  const handleYourBeersScreen = () => {
    navigation.navigate("YourBeers", { user_id: user.id });
  };

  const handleSearchScreen = () => {
    navigation.navigate("SearchBeers", { user_id: user.id });
  };

  const handleBadgesScreen = () => {
    navigation.navigate("YourBadges", { user_id: user.id });
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        const url = `${API_URL}/api/userbyuid/${uid}`;
        async function getUserHelper(): Promise<User> {
          const response = await fetch(url);
          const cur_user = await response.json();
          return cur_user;
        }
        const cur_user = await getUserHelper();
        setUser(cur_user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Beer Passport</Text>
        <Text style={styles.welcome}>Welcome {user.user_name}</Text>
        <TouchableOpacity onPress={handleSearchScreen} style={styles.button}>
          <Text style={styles.buttonText}>Search Beers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCategoryScreen} style={styles.button}>
          <Text style={styles.buttonText}>Find Beer By Category</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleYourBeersScreen} style={styles.button}>
          <Text style={styles.buttonText}>Your Beers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBadgesScreen} style={styles.button}>
          <Text style={styles.buttonText}>Your Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  beerCard: {
    backgroundColor: "white",
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
});
