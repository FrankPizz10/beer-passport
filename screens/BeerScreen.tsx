import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { API_URL } from "@env";
import { Beer } from "../Models/SQLData";
import { BeerProps } from "../props";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer);

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const url = `${API_URL}/api/beers/${props.route.params.id}}`;
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
  }, []);

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
});
