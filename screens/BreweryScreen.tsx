import { EXPO_PUBLIC_API_URL } from "@env";
import { BasicBeer, Brewery } from "../Models/SQLData";
import { BreweryProps } from "../props";
import { useEffect, useState } from "react";
import { auth } from "../Models/firebase";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import {
  BackgroundColor,
  MainButtonColor,
  TitleColor,
  TryLikeButtonColor,
} from "../Styles/colors";
import SimpleCard from "../components/SimpleCard";
import { useNavigation } from "@react-navigation/core";

const BreweryScreen = (props: BreweryProps) => {
  const [brewery, setBrewery] = useState<Brewery>({} as Brewery);
  const [breweryBeers, setBreweryBeers] = useState<BasicBeer[]>(
    [] as BasicBeer[],
  );
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/breweries/${props.route.params.brewery_id}`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const brewery = await response.json();
        setBrewery(brewery);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBrewery();
    const fetchBreweryBeers = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/breweries/${props.route.params.brewery_id}/beers`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const beers = await response.json();
        setBreweryBeers(beers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBreweryBeers();
  }, [props.route.params.brewery_id]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{brewery.name}</Text>
      </View>
      <View style={styles.breweryContainer}>
        <Text style={styles.style}>{brewery.city}</Text>
        <Text style={styles.style}>{brewery.state}</Text>
        <Text style={styles.style}>{brewery.country}</Text>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        {breweryBeers?.map((beer) => {
          return (
            <SimpleCard
              key={beer.id}
              item={beer}
              handleCardPress={handleBeerPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BreweryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: Dimensions.get("window").width / 12,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  breweryTitle: {
    fontSize: Dimensions.get("window").width / 15,
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
  },
  styleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  style: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: Dimensions.get("window").width / 20,
    width: Dimensions.get("window").width - 60,
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  abv: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  abvContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brewery: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  breweryContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scrollViewContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: TryLikeButtonColor,
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
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
