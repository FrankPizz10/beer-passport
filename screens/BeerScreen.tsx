import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "@env";
import { Beer, UserBeer } from "../Models/SQLData";
import { BeerProps } from "../props";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer);
  const [userBeer, setUserBeer] = useState({} as UserBeer);

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const url = `${API_URL}/api/beers/${props.route.params.beer_id}}`;
        async function fetchBeerHelper(): Promise<Beer> {
          const response = await fetch(url);
          const beer = await response.json();
          return beer;
        }
        const beer = await fetchBeerHelper();
        setBeer(beer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBeer();
    const fetchUserBeer = async () => {
      try {
        const url = `${API_URL}/api/userbeer/${props.route.params.user_id}/${props.route.params.beer_id}}`;
        async function fetchUserBeerHelper(): Promise<UserBeer> {
          const response = await fetch(url);
          const userBeer = await response.json();
          return userBeer;
        }
        const userBeer = await fetchUserBeerHelper();
        setUserBeer(userBeer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserBeer();
  }, []);

  const handleTriedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user_id: props.route.params.user_id,
          beer_id: props.route.params.beer_id,
          tried: true,
          liked: userBeer.liked,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newUserBeer = await response.json();
      console.log(newUserBeer);
      setUserBeer(newUserBeer);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user_id: props.route.params.user_id,
          beer_id: props.route.params.beer_id,
          tried: userBeer.tried,
          liked: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newUserBeer = await response.json();
      setUserBeer(newUserBeer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      {beer.style && (
        <Text style={styles.style}>Style: {beer.style.style_name}</Text>
      )}
      {!!beer.descript && (
        <Text style={styles.description}>Description: {beer.descript}</Text>
      )}
      {beer.abv && <Text style={styles.abv}>ABV: {beer.abv}</Text>}
      {beer.brewery && (
        <Text style={styles.brewery}>Brewery: {beer.brewery.name}</Text>
      )}
      {userBeer.tried && <Text>Tried</Text>}
      {userBeer.liked && <Text>Liked</Text>}
      <View>
        <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
          <Text> Tried </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
          <Text> Liked </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BeerScreen;

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
  style: {
    fontSize: 30,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    width: 400,
  },
  abv: {
    fontSize: 20,
    fontWeight: "bold",
  },
  brewery: {
    fontSize: 20,
    fontWeight: "bold",
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
});
