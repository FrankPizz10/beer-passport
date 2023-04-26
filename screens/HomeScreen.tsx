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
import { HomeProps } from "../types";
import { User } from "../Models/Collections";
import { API_URL } from "@env";
import { Beer } from "../Models/SQLData";

const HomeScreen = (props: HomeProps) => {
  const [users, setUsers] = useState([] as User[]);
  const [beers, setBeers] = useState([] as Beer[]);

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
    const fetchUsers = async () => {
      try {
        const url = API_URL + "/api/users";
        // console.log(url);
        // const { data: users } = await axios.get<User[]>(url);
        async function fetchUsersHelper(): Promise<User[]> {
          const response = await fetch(url);
          const users = await response.json();
          return users;
        }
        const users = await fetchUsersHelper();
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };
    // fetchUsers();
    const fetchBeers = async () => {
      try {
        const url = API_URL + "/api/beers";
        async function fetchBeersHelper(): Promise<Beer[]> {
          const response = await fetch(url);
          const beers = await response.json();
          return beers;
        }
        const beers = await fetchBeersHelper();
        setBeers(beers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBeers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beer List</Text>
      <Text style={styles.welcome}>Welcome {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleCategoryPage} style={styles.button}>
        <Text style={styles.buttonText}>Find Beer By Category</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Your Beers</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity> */}
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
