import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Collection } from "../Models/SQLData";
import { fetchAllCollections } from "../Models/Requests";
import { AllCollectionsProps } from "../props";
import { useNavigation } from "@react-navigation/core";
// import HomeButton from "./HomeButton";

const AllCollectionsScreen = (props: AllCollectionsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [collections, setCollections] = useState([] as Collection[]);

  const handleCollectionPress = (collectionId: number) => {
    navigation.navigate("Collection", {
      collection_id: collectionId,
    });
  };

  useEffect(() => {
    const getCollectionData = async () => {
      await fetchAllCollections()
        .then((data) => setCollections(data))
        .catch((error) => console.log(error));
    };
    getCollectionData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.ScreenTitle}>CollectionsScreen</Text>
      <ScrollView>
        {collections?.map((collection) => {
          return (
            <View key={collection.id} style={styles.beerCard}>
              <TouchableOpacity
                onPress={() => handleCollectionPress(collection.id)}
              >
                <Text>{collection.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllCollectionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  ScreenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
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
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
