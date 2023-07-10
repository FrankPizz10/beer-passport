import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "@env";
import { Beer, UserBeer } from "../Models/SQLData";
import { BeerProps } from "../props";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer);
  const [userBeer, setUserBeer] = useState({} as UserBeer);
  const [tried, setTried] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleTriedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const userBeer: UserBeer = {
        user_id: props.route.params.user_id,
        beer_id: props.route.params.beer_id,
        liked: false,
        collection_id: props.route.params.collection_id,
      };
      console.log(userBeer);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          userBeer,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newUserBeer = await response.json();
      console.log(newUserBeer);
      setUserBeer(newUserBeer);
      setTried(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const userBeer: UserBeer = {
        user_id: props.route.params.user_id,
        beer_id: props.route.params.beer_id,
        liked: true,
        collection_id: props.route.params.collection_id,
      };
      console.log(userBeer);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          userBeer,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newUserBeer = await response.json();
      setUserBeer(newUserBeer);
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const url = `${API_URL}/api/beers/${props.route.params.beer_id}`;
        const response = await fetch(url);
        const beer = await response.json();
        setBeer(beer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBeer();
    const fetchUserBeer = async () => {
      try {
        const url = `${API_URL}/api/userbeer/${props.route.params.user_id}/${props.route.params.beer_id}`;
        const response = await fetch(url);
        const userBeer = await response.json();
        setUserBeer(userBeer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserBeer();
  }, [tried, liked]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{beer.name}</Text>
      </View>
      <View style={styles.styleContainer}>
        {beer.style && (
          <Text style={styles.style}>Style: {beer.style.style_name}</Text>
        )}
      </View>
      {(beer.abv || beer.abv === 0) && (
        <View style={styles.abvContainer}>
          <Text style={styles.abv}>ABV: {beer.abv}</Text>
        </View>
      )}
      {!!beer.descript && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>Description: {beer.descript}</Text>
        </View>
      )}
      <View style={styles.breweryContainer}>
        {beer.brewery && (
          <Text style={styles.brewery}>Brewery: {beer.brewery.name}</Text>
        )}
      </View>
      <View style={styles.breweryContainer}>
        {beer.collection_id && (
          <Text style={styles.brewery}>Collection: {beer.collection_id}</Text>
        )}
      </View>
      <View style={styles.triedLikedContainer}>
        {userBeer.id && (
          <Text style={styles.triedLiked}>You tried this beer!</Text>
        )}
        {userBeer.liked && (
          <Text style={styles.triedLiked}>You liked this beer!</Text>
        )}
      </View>
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
    marginTop: 50,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
  },
  styleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  abv: {
    fontSize: 20,
    fontWeight: "bold",
  },
  abvContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brewery: {
    fontSize: 20,
    fontWeight: "bold",
  },
  breweryContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
  triedLikedContainer: {
    marginBottom: 20,
  },
  triedLiked: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
