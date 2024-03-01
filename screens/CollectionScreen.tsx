import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Beer, Collection, CollectionBeer } from "../Models/SQLData";
import {
  fetchBeer,
  fetchCollection,
  fetchCollectionBeersByCollectionId,
} from "../Models/Requests";
import { CollectionProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BackgroundColor } from "../Styles/colors";
import { standardStyles } from "../Styles/styles";

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
  }, [props.route.params.collection_id]);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.CollectionTitle} maxFontSizeMultiplier={1.1}>
          {collection?.name}
        </Text>
        <Text style={styles.CollectionDetails} maxFontSizeMultiplier={1.2}>
          {collection?.description}
        </Text>
        <Text style={styles.CollectionDetails} maxFontSizeMultiplier={1.2}>
          Difficulty: {collection?.difficulty}
        </Text>
      </View>
      <ScrollView>
        {beers?.map((beer) => {
          return (
            <TouchableOpacity
              key={beer.id}
              style={standardStyles.basicCard}
              onPress={() => handleBeerPress(beer.id)}
            >
              <Text
                style={standardStyles.basicCardText}
                maxFontSizeMultiplier={1.2}
              >
                {beer.name}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: BackgroundColor,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  CollectionTitle: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  CollectionDetails: {
    fontSize: Dimensions.get("window").width * 0.06,
    textAlign: "center",
    margin: 10,
  },
});
