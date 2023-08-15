import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Beer, Collection, CollectionBeer } from "../Models/SQLData";
import {
  fetchBeer,
  fetchCollection,
  fetchCollectionBeersByCollectionId,
} from "../Models/Requests";
import { CollectionProps } from "../props";
import { useNavigation } from "@react-navigation/core";

const CollectionScreen = (props: CollectionProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [collection, setCollection] = useState({} as Collection | undefined);
  const [beers, setBeers] = useState([] as Beer[]);

  useEffect(() => {
    const getCollectionBeers = async () => {
      await fetchCollectionBeersByCollectionId(props.route.params.collection_id)
        .then((collectionBeer) =>
          collectionBeer.map((beer) => {
            fetchBeer(beer.beer_id).then((beer) => {
              if (beer) {
                setBeers([...beers, beer]);
              }
            });
          })
        )
        .catch((error) => console.log(error));
    };
    getCollectionBeers();
    const getCollectionData = async () => {
      await fetchCollection(props.route.params.collection_id)
        .then((data) => setCollection(data))
        .catch((error) => console.log(error));
    };
    getCollectionData();
  }, [props.route.params.collection_id, props.route.params.user_id]);

  const handleBeerPress = (
    beerId: number,
    collectionId: number | undefined
  ) => {
    navigation.navigate("Beer", {
      user_id: props.route.params.user_id,
      beer_id: beerId,
    });
  };

  return (
    <View>
      <Text style={styles.CollectionTitle}>{collection?.name}</Text>
      <Text style={styles.CollectionDetails}>{collection?.description}</Text>
      <Text style={styles.CollectionDetails}>
        Difficulty: {collection?.difficulty}
      </Text>
      <ScrollView>
        {beers?.map((beer) => {
          return (
            <View key={beer.id} style={styles.beerCard}>
              <TouchableOpacity onPress={() => handleBeerPress(beer.id, 1)}>
                <Text>{beer.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: "white",
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
  CollectionTitle: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
  },
  CollectionDetails: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});
