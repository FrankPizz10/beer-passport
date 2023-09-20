import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "@env";
import { Beer, CollectionBeer, UserBeer } from "../Models/SQLData";
import { BeerProps } from "../props";
import {
  fetchBeer,
  fetchCollection,
  fetchCollectionBeersByBeerId,
  fetchUserBeer,
} from "../Models/Requests";
import { auth } from "../Models/firebase";
// import HomeButton from "./HomeButton";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer | undefined);
  const [userBeer, setUserBeer] = useState({} as UserBeer | undefined);
  const [collectionId, setCollectionId] = useState<number | undefined>(
    undefined
  );
  const [tried, setTried] = useState(false);
  const [liked, setLiked] = useState(false);
  const [collectionNames, setCollectionNames] = useState([] as string[]);

  const handleTriedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          beer_id: props.route.params.beer_id,
          liked: false,
          collection_id: collectionId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const newUserBeer = await response.json();
      setUserBeer(newUserBeer);
      setTried(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          beer_id: props.route.params.beer_id,
          liked: true,
          collection_id: collectionId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const newUserBeer = await response.json();
      setUserBeer(newUserBeer);
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllBeerData = async () => {
      await Promise.all([
        fetchBeer(props.route.params.beer_id),
        fetchUserBeer(props.route.params.beer_id),
        fetchCollectionBeersByBeerId(props.route.params.beer_id),
      ])
        .then((results) => {
          setBeer(results[0]);
          setUserBeer(results[1]);
          results[2].forEach((collectionBeer: CollectionBeer) => {
            fetchCollection(collectionBeer.collection_id).then((collection) => {
              if (!collection) return;
              setCollectionId(collection.id);
              if (collectionNames.includes(collection.name)) return;
              setCollectionNames((prevCollectionNames) => [
                ...prevCollectionNames,
                collection.name,
              ]);
            });
          });
        })
        .catch((error) => {
          console.log("Error fetching data");
          console.log(error);
        });
    };
    getAllBeerData();
  }, [tried, liked, props.route.params.beer_id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.HomeButton}>
        <HomeButton route={props.route} navigation={props.navigation} />
      </View> */}
      {beer && (
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{beer.name}</Text>
          </View>
          <View style={styles.styleContainer}>
            {beer.style && (
              <Text style={styles.style}>Style: {beer.style.style_name}</Text>
            )}
          </View>
          {(beer.abv || beer.abv === 0) && (
            <View style={styles.abvContainer}>
              <Text style={styles.abv}>ABV: {beer.abv}</Text>
            </View>
          )}
          {!!beer.descript && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Description: {beer.descript}
              </Text>
            </View>
          )}
          <View style={styles.breweryContainer}>
            {beer.brewery && (
              <Text style={styles.brewery}>Brewery: {beer.brewery.name}</Text>
            )}
          </View>
          <View style={styles.breweryContainer}>
            {collectionNames.length > 0 && (
              <Text style={styles.brewery}>
                Collections: {collectionNames.join(", ")}
              </Text>
            )}
          </View>
          <View style={styles.triedLikedContainer}>
            {userBeer && userBeer.id && (
              <Text style={styles.triedLiked}>You tried this beer!</Text>
            )}
            {userBeer && userBeer.liked && (
              <Text style={styles.triedLiked}>You liked this beer!</Text>
            )}
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
              <Text> Tried </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
              <Text> Liked </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BeerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
  },
  styleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  style: {
    fontSize: 30,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    width: 400,
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  abv: {
    fontSize: 20,
    fontWeight: "bold",
  },
  abvContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brewery: {
    fontSize: 20,
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
  button: {
    backgroundColor: "#b266b2",
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
  triedLikedContainer: {
    marginBottom: 20,
  },
  triedLiked: {
    fontSize: 20,
    fontWeight: "bold",
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
