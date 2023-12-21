import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { YourBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBeers } from "../Controllers/YourBeersController";
import { BackgroundColor } from "./colors";
// import HomeButton from "./HomeButton";

const YourBeersScreen = (props: YourBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [tried, setTried] = useState(true);
  const [liked, setLiked] = useState(false);

  const { triedBeers, likedBeers } = useYourBeers(undefined);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const handleTriedPress = () => {
    setTried(true);
    setLiked(false);
  };

  const handleLikedPress = () => {
    setTried(false);
    setLiked(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}> My Beers </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
          <Text> Tried </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
          <Text> Liked </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tried &&
          triedBeers?.map((beer) => {
            return (
              <View key={beer.id} style={styles.beerCard}>
                <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                  <Text>{beer.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        {tried && triedBeers?.length === 0 && (
          <View style={styles.beerCard}>
            <Text>You have no tried beers yet!</Text>
          </View>
        )}
        {liked &&
          likedBeers &&
          likedBeers?.map((beer) => {
            return (
              <View key={beer.id} style={styles.beerCard}>
                <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                  <Text>{beer.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        {liked && likedBeers?.length === 0 && (
          <View style={styles.beerCard}>
            <Text>You have no liked beers yet!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default YourBeersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
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
  dropDown: {
    backgroundColor: BackgroundColor,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  beerCard: {
    backgroundColor: "lightblue",
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
