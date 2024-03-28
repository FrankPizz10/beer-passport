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
import { SearchBreweriesProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BasicBrewery } from "../Models/SQLData";
import { fetchAllBreweries } from "../Models/Requests";
import { useSearchFilter } from "../Controllers/SearchController";
import { BackgroundColor } from "../Styles/colors";
import { useFocusEffect } from "@react-navigation/native";
import SimpleCard from "../components/SimpleCard";

const SearchBreweriesScreen = (props: SearchBreweriesProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [breweries, setBreweries] = useState<BasicBrewery[]>(
    [] as BasicBrewery[],
  );
  const [initalBrweries, setInitialBreweries] = useState<BasicBrewery[]>(
    [] as BasicBrewery[],
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBreweryPress = (breweryId: number) => {
    navigation.navigate("Brewery", {
      brewery_id: breweryId,
    });
  };

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
    initialList: breweries,
    nameKey: "name",
    defaultResults: [],
  });

  useFocusEffect(
    useCallback(() => {
      fetchAllBreweries().then((breweries) => {
        if (breweries && breweries.length === 0) {
          return;
        }
        setBreweries(breweries!);
        // Populate initial breweries with random 20 breweries
        const randomBreweries = new Set<BasicBrewery>();
        while (randomBreweries.size < 20) {
          const randomIndex = Math.floor(Math.random() * breweries!.length);
          randomBreweries.add(breweries![randomIndex]);
        }
        setInitialBreweries(Array.from(randomBreweries));
      });
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
          placeholder="Search for a brewery"
          placeholderTextColor="gray"
          maxFontSizeMultiplier={1.2}
        />
      </TouchableWithoutFeedback>
      {searchInput.length > 0 && (
        <ScrollView>
          {filteredList?.map((brewery) => {
            return (
              <SimpleCard
                key={brewery.id}
                item={brewery}
                handleCardPress={handleBreweryPress}
              />
            );
          })}
        </ScrollView>
      )}
      {searchInput.length === 0 && initalBrweries.length > 0 && (
        <ScrollView>
          {initalBrweries?.map((brewery) => {
            return (
              <SimpleCard
                key={brewery.id}
                item={brewery}
                handleCardPress={handleBreweryPress}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default SearchBreweriesScreen;

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
