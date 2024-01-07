import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BasicBeer } from "../Models/SQLData";
import { fetchAllBeers, fetchNewestBeer } from "../Models/Requests";
import { useSearchFilter } from "../Controllers/SearchController";
import { BackgroundColor } from "../Styles/colors";
import { useLocalStorage } from "../Controllers/AsyncStorageHelper";
import { standardStyles } from "../Styles/styles";
import { API_URL } from "@env";
import { auth } from "../Models/firebase";
import { useFocusEffect } from "@react-navigation/native";

const getNewestStoredBeer = async () => {
  const storedData = await AsyncStorage.getItem("beers");
  if (storedData) {
    const storedBeers = JSON.parse(storedData) as BasicBeer[];
    const storedNewestBeer = storedBeers.reduce((prev, current) =>
      prev.id > current.id ? prev : current,
    );
    return storedNewestBeer.last_mod;
  }
  return undefined;
};

const SearchBeerScreen = (props: SearchBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [beers, setBeers] = useLocalStorage<BasicBeer[]>(
    "beers",
    [] as BasicBeer[],
    fetchAllBeers,
    fetchNewestBeer,
    getNewestStoredBeer,
  );
  const [mostPopularBeers, setMostPopularBeers] = useState<BasicBeer[]>([]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
    initialList: beers,
    nameKey: "name",
    defaultResults: mostPopularBeers,
  });

  useFocusEffect(
    useCallback(() => {
      const getMostPopularBeers = async () => {
        const url = `${API_URL}/api/toplikedbeers`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const mostPopularBeers = await response.json();
        // alphabetize
        // mostPopularBeers.sort((a: BasicBeer, b: BasicBeer) =>
        //   a.name.localeCompare(b.name),
        // );
        setMostPopularBeers(mostPopularBeers);
      };
      getMostPopularBeers();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <TextInput
          style={styles.input}
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search for a beer"
          placeholderTextColor="gray"
        />
      </TouchableWithoutFeedback>
      {searchInput.length > 0 && (
        <ScrollView>
          {filteredList?.map((beer) => {
            return (
              <View key={beer.id} style={standardStyles.basicCard}>
                <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                  <Text style={standardStyles.basicCardText}>{beer.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
      {searchInput.length === 0 && mostPopularBeers.length > 0 && (
        <ScrollView>
          {mostPopularBeers?.map((beer) => {
            return (
              <View key={beer.id} style={standardStyles.basicCard}>
                <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                  <Text style={standardStyles.basicCardText}>{beer.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});
