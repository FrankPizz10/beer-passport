import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { HomeProps } from "../props";
import { User } from "../Models/Collections";
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

  const handleCategoryPage = () => {
    navigation.navigate("Category");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        const url = `${API_URL}/api/users/${uid}`;
        console.log(url);
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
    <View style={styles.container}>
      <Text style={styles.title}>Beer List</Text>
      <Text style={styles.welcome}>Welcome {user.username}</Text>
      <TouchableOpacity onPress={handleCategoryPage} style={styles.button}>
        <Text style={styles.buttonText}>Find Beer By Category</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Your Beers</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      {/* <ScrollView> */}
      {/* {users.map((user) => (
          <View key={user.id}>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Age: {user.age}</Text>
          </View>
        ))} */}
      {/* {beers.map((beer) => (
          <View key={beer.id} style={styles.beerCard}>
            <Text>Name: {beer.name}</Text>
            <Text>ABV: {beer.abv}</Text>
            <Text>Description: {beer.descript}</Text>
          </View>
        ))} */}
      {/* </ScrollView> */}
    </View>
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
