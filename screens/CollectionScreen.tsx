import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Beer, Collection, CollectionBeer } from "../Models/SQLData";
import {
  fetchBeer,
  fetchCollection,
  fetchCollectionBeersByCollectionId,
} from "../Models/Requests";
import { CollectionProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import HomeButton from "./HomeButton";

const CollectionScreen = (props: CollectionProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [collection, setCollection] = useState({} as Collection | undefined);
  const [beers, setBeers] = useState([] as Beer[]);

  useEffect(() => {
    const getCollectionData = async () => {
      await Promise.all([
        fetchCollectionBeersByCollectionId(props.route.params.collection_id),
        fetchCollection(props.route.params.collection_id),
      ]).then((results) => {
        setCollection(results[1]);
        results[0].forEach((collectionBeer: CollectionBeer) => {
          fetchBeer(collectionBeer.beer_id).then((beer) => {
            if (!beer || beers.find((b) => b.id === beer.id)) return;
            setBeers((prevBeers) => [...prevBeers, beer]);
          });
        });
      });
    };
    getCollectionData();
  }, [props.route.params.collection_id, props.route.params.user_id]);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      user_id: props.route.params.user_id,
      beer_id: beerId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.HomeButton}>
        <HomeButton route={props.route} navigation={props.navigation} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.CollectionTitle}>{collection?.name}</Text>
        <Text style={styles.CollectionDetails}>{collection?.description}</Text>
        <Text style={styles.CollectionDetails}>
          Difficulty: {collection?.difficulty}
        </Text>
      </View>
      <ScrollView>
        {beers?.map((beer) => {
          return (
            <View key={beer.id} style={styles.beerCard}>
              <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                <Text>{beer.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
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
  CollectionTitle: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  CollectionDetails: {
    fontSize: 22,
    textAlign: "center",
    margin: 10,
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
