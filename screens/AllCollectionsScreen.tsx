import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Collection } from "../Models/SQLData";
import { fetchAllCollections } from "../Models/Requests";
import { AllCollectionsProps } from "../props";
import { useNavigation } from "@react-navigation/core";

const AllCollectionsScreen = (props: AllCollectionsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [collections, setCollections] = useState([] as Collection[]);

  const handleCollectionPress = (collectionId: number) => {
    navigation.navigate("Collection", {
      user_id: props.route.params.user_id,
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
    <View>
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
    </View>
  );
};

export default AllCollectionsScreen;

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  ScreenTitle: {
    fontSize: 20,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});
