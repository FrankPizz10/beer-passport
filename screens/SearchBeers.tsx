import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouterProps, SearchBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BasicBeer, Beer } from "../Models/SQLData";
import { fetchAllBeers } from "../Models/Requests";
import { useSearchFilter } from "../Controllers/SearchController";
import { BackgroundColor } from "./colors";
import { useLocalStorage } from "../Controllers/AsyncStorageHelper";

const SearchBeerScreen = (props: SearchBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [beers, setBeers] = useLocalStorage<BasicBeer[]>("beers", [] as BasicBeer[], fetchAllBeers);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
    initialList: beers,
    nameKey: "name",
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.input}
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
        placeholder="Search for a beer"
      />
      <ScrollView>
        {filteredList?.map((beer) => {
          return (
            <View key={beer.id} style={styles.beerCard}>
              <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                <Text>{beer.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SearchBeerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});
