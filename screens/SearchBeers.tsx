import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SearchBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { SelectList } from "react-native-dropdown-select-list";
import { Beer, Category } from "../Models/SQLData";
import { API_URL } from "@env";
import { useCategory } from "../Controllers/CategoryController";
import { fetchAllBeers } from "../Models/Requests";

const useSearchFilter = (initialList: Beer[]) => {
  const [searchInput, setSearchInput] = useState("");

  const filteredList = useMemo(() => {
    return initialList
      .filter((beer) =>
        beer.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .slice(0, 20)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchInput, initialList]);

  return {
    searchInput,
    setSearchInput,
    filteredList,
  };
};

const SearchBeerScreen = (props: SearchBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [beers, setBeers] = useState([] as Beer[]);

  useEffect(() => {
    const getBeersData = async () => {
      await fetchAllBeers()
        .then((data) => setBeers(data))
        .catch((error) => console.log(error));
    };
    getBeersData();
  }, []);

  const handleBeerPress = (
    beerId: number,
    collectionId: number | undefined
  ) => {
    navigation.navigate("Beer", {
      user_id: props.route.params.user_id,
      beer_id: beerId,
      collection_id: collectionId,
    });
  };

  const { searchInput, setSearchInput, filteredList } = useSearchFilter(beers);

  return (
    <View>
      {/* Search Bar */}
      <TextInput
        style={styles.input}
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
      />
      <ScrollView>
        {filteredList?.map((beer) => {
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

export default SearchBeerScreen;

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
});
