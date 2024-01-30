import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { SearchBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BasicBeer } from "../Models/SQLData";
import { fetchAllBeers } from "../Models/Requests";
import { useSearchFilter } from "../Controllers/SearchController";
import { BackgroundColor } from "../Styles/colors";
import { EXPO_PUBLIC_API_URL } from "@env";
import { auth } from "../Models/firebase";
import { useFocusEffect } from "@react-navigation/native";
import BeerCard from "../components/BeerCard";

// const getNewestStoredBeer = async () => {
//   const storedData = await AsyncStorage.getItem("beers");
//   if (storedData) {
//     const storedBeers = JSON.parse(storedData) as BasicBeer[];
//     const storedNewestBeer = storedBeers.reduce((prev, current) =>
//       prev.id > current.id ? prev : current
//     );
//     return storedNewestBeer.last_mod;
//   }
//   return undefined;
// };

const SearchBeerScreen = (props: SearchBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [beers, setBeers] = useState<BasicBeer[]>([] as BasicBeer[]);
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
        const url = `${EXPO_PUBLIC_API_URL}/api/toplikedbeers`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const mostPopularBeers = await response.json();
        setMostPopularBeers(mostPopularBeers);
        fetchAllBeers().then((beers) => {
          setBeers(beers);
        });
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
          maxFontSizeMultiplier={1.2}
        />
      </TouchableWithoutFeedback>
      {searchInput.length > 0 && (
        <ScrollView>
          {filteredList?.map((beer) => {
            return (
              <BeerCard
                key={beer.id}
                beer={beer}
                handleBeerPress={handleBeerPress}
              />
            );
          })}
        </ScrollView>
      )}
      {searchInput.length === 0 && mostPopularBeers.length > 0 && (
        <ScrollView>
          {mostPopularBeers?.map((beer) => {
            return (
              <BeerCard
                key={beer.id}
                beer={beer}
                handleBeerPress={handleBeerPress}
              />
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
    height: Dimensions.get("window").height / 20,
    fontSize: Dimensions.get("window").width / 25,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});
