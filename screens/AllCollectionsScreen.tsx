import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Collection } from "../Models/SQLData";
import { fetchAllCollections } from "../Models/Requests";
import { AllCollectionsProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BackgroundColor } from "../Styles/colors";
import { standardStyles } from "../Styles/styles";

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
      <Text style={styles.ScreenTitle}>Collections</Text>
      <ScrollView>
        {collections?.map((collection) => {
          return (
            <View key={collection.id} style={standardStyles.basicCard}>
              <TouchableOpacity
                onPress={() => handleCollectionPress(collection.id)}
              >
                <Text style={standardStyles.basicCardText}>
                  {collection.name}
                </Text>
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
    backgroundColor: BackgroundColor,
  },
  ScreenTitle: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
