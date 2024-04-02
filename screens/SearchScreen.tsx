import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { SearchBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BasicBeer, BasicBrewery, Category } from "../Models/SQLData";
import {
  fetchAllBeers,
  fetchAllBreweries,
  fetchMostPopularBreweries,
} from "../Models/Requests";
import { useSearchFilter } from "../Controllers/SearchController";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";
import { EXPO_PUBLIC_API_URL } from "@env";
import { auth } from "../Models/firebase";
import { useFocusEffect } from "@react-navigation/native";
import SimpleCard from "../components/SimpleCard";

const SearchScreen = (props: SearchBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [beers, setBeers] = useState<BasicBeer[]>([] as BasicBeer[]);
  const [mostPopularBeers, setMostPopularBeers] = useState<BasicBeer[]>([]);
  const [filterButtonClicked, setFilterButtonClicked] = useState(0);
  const [breweries, setBreweries] = useState<BasicBrewery[]>(
    [] as BasicBrewery[],
  );
  const [mostPopularBreweries, setMostPopularBreweries] = useState<
    BasicBrewery[]
  >([] as BasicBrewery[]);
  const [categories, setCategories] = useState<Category[]>([] as Category[]);
  const [searchInput, setSearchInput] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const handleBreweryPress = (breweryId: number) => {
    navigation.navigate("Brewery", {
      brewery_id: breweryId,
    });
  };

  const handleCategoryPress = (categoryId: number) => {
    navigation.navigate("Category", {
      cat_id: categoryId,
    });
  };

  const filteredBeerList = useSearchFilter({
    searchInput,
    initialList: beers,
    nameKey: "name",
    defaultResults: mostPopularBeers,
  });

  const filteredBreweryList = useSearchFilter({
    searchInput,
    initialList: breweries,
    nameKey: "name",
    defaultResults: mostPopularBreweries,
  });

  const filteredCategoryList = useSearchFilter({
    searchInput,
    initialList: categories,
    nameKey: "cat_name",
    defaultResults: categories,
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
      const getAllCategories = async () => {
        const url = `${EXPO_PUBLIC_API_URL}/api/categories`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const categories = await response.json();
        setCategories(categories);
      };
      const fetchData = async () => {
        await getMostPopularBeers();
        await getAllCategories();
        const breweries = await fetchAllBreweries();
        if (breweries && breweries.length === 0) {
          return;
        }
        setBreweries(breweries!);
        const mostPopularBreweries = await fetchMostPopularBreweries();
        if (mostPopularBreweries && mostPopularBreweries.length === 0) {
          return;
        }
        setMostPopularBreweries(mostPopularBreweries!);
      };
      fetchData();
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
          placeholder="Search for a beer, brewery, or category"
          placeholderTextColor="gray"
          maxFontSizeMultiplier={1.2}
          autoFocus
        />
      </TouchableWithoutFeedback>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={{
            ...styles.filterButton,
            ...(filterButtonClicked === 0 ? styles.clickedFilterButton : {}),
          }}
          onPress={() => setFilterButtonClicked(0)}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(filterButtonClicked === 0 ? styles.clickedButtonText : {}),
            }}
          >
            Beers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.filterButton,
            ...(filterButtonClicked === 1 ? styles.clickedFilterButton : {}),
          }}
          onPress={() => setFilterButtonClicked(1)}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(filterButtonClicked === 1 ? styles.clickedButtonText : {}),
            }}
          >
            Breweries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.filterButton,
            ...(filterButtonClicked === 2 ? styles.clickedFilterButton : {}),
          }}
          onPress={() => setFilterButtonClicked(2)}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(filterButtonClicked === 2 ? styles.clickedButtonText : {}),
            }}
          >
            Categories
          </Text>
        </TouchableOpacity>
      </View>
      {filterButtonClicked === 0 && searchInput.length > 0 && (
        <ScrollView>
          {filteredBeerList?.map((beer) => {
            return (
              <SimpleCard
                key={beer.id}
                item={beer}
                handleCardPress={handleBeerPress}
              />
            );
          })}
        </ScrollView>
      )}
      {filterButtonClicked === 0 &&
        searchInput.length === 0 &&
        mostPopularBeers.length > 0 && (
          <ScrollView>
            {mostPopularBeers?.map((beer) => {
              return (
                <SimpleCard
                  key={beer.id}
                  item={beer}
                  handleCardPress={handleBeerPress}
                />
              );
            })}
          </ScrollView>
        )}
      {filterButtonClicked === 1 && searchInput.length > 0 && (
        <ScrollView>
          {filteredBreweryList?.map((brewery) => {
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
      {filterButtonClicked === 1 &&
        searchInput.length === 0 &&
        mostPopularBreweries.length > 0 && (
          <ScrollView>
            {mostPopularBreweries?.map((brewery) => {
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
      {filterButtonClicked === 2 && (
        <ScrollView>
          {filteredCategoryList?.map((category) => {
            return (
              <SimpleCard
                key={category.id}
                item={{
                  id: category.id,
                  name: category.cat_name,
                }}
                handleCardPress={handleCategoryPress}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default SearchScreen;

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
    borderRadius: 5,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  filterButton: {
    padding: 10,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    justifyContent: "center",
  },
  buttonText: {
    fontSize: Dimensions.get("window").width * 0.04,
    color: "black",
  },
  clickedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  clickedFilterButton: {
    backgroundColor: MainHighlightColor,
  },
});
