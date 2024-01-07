import React, { useEffect, useState } from "react";
import {
  ScrollView,
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
import {
  BackgroundColor,
  MainHighlightColor,
  TryLikeButtonColor,
} from "../Styles/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer | undefined);
  const [userBeer, setUserBeer] = useState({} as UserBeer | undefined);
  const [collectionId, setCollectionId] = useState<number | undefined>(
    undefined,
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
      setTried(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnLikedPress = async () => {
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
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnTriedPress = async () => {
    try {
      const url = `${API_URL}/api/userbeers/${userBeer?.beer_id}`;
      const token = await auth.currentUser?.getIdToken();
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setUserBeer({} as UserBeer);
      setTried(false);
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCollectionNamesAndIds = (collectionBeers: CollectionBeer[]) => {
    collectionBeers.forEach((collectionBeer: CollectionBeer) => {
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
  };

  useEffect(() => {
    const getAllBeerData = async () => {
      const beer = await fetchBeer(props.route.params.beer_id);
      setBeer(beer);
      const userBeer = await fetchUserBeer(props.route.params.beer_id);
      setUserBeer(userBeer);
      if (userBeer && userBeer.liked) setLiked(true);
      if (userBeer?.id) setTried(true);
      const collectionBeers = await fetchCollectionBeersByBeerId(
        props.route.params.beer_id,
      );
      updateCollectionNamesAndIds(collectionBeers);
    };

    getAllBeerData();
  }, [props.route.params.beer_id]);

  return (
    <ScrollView style={styles.container}>
      {beer && (
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{beer.name}</Text>
            <Text style={styles.breweryTitle}>{beer?.brewery?.name}</Text>
          </View>
          <View>
            {!tried && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleTriedPress}
              >
                <Ionicons
                  name="checkbox-outline"
                  size={24}
                  color={MainHighlightColor}
                />
                <Text style={styles.buttonText}> Try </Text>
              </TouchableOpacity>
            )}
            {!liked && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleLikedPress}
              >
                <Entypo name="star-outlined" size={24} color="gold" />
                <Text style={styles.buttonText}> Like </Text>
              </TouchableOpacity>
            )}
            {tried && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleUnTriedPress}
              >
                <Ionicons
                  name="checkbox"
                  size={24}
                  color={MainHighlightColor}
                />
                <Text style={styles.buttonText}> Un Try </Text>
              </TouchableOpacity>
            )}
            {liked && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleUnLikedPress}
              >
                <Entypo name="star" size={24} color="gold" />
                <Text style={styles.buttonText}> Un Like </Text>
              </TouchableOpacity>
            )}
          </View>
          {beer.style && (
            <View style={styles.styleContainer}>
              <Text style={styles.style}>{beer.style.style_name}</Text>
            </View>
          )}
          {(beer.abv || beer.abv === 0) && (
            <View style={styles.abvContainer}>
              <Text style={styles.abv}>ABV: {beer.abv}</Text>
            </View>
          )}
          {!!beer.descript && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{beer.descript}</Text>
            </View>
          )}
          <View style={styles.breweryContainer}>
            {collectionNames.length > 0 && (
              <Text style={styles.brewery}>
                Collections: {collectionNames.join(", ")}
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default BeerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  breweryTitle: {
    fontSize: 30,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    width: 350,
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  triedLikedContainer: {
    marginBottom: 20,
  },
  triedLiked: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  HomeButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
    height: 80,
  },
});
