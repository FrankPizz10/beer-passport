import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Image,
} from "react-native";
import { EXPO_PUBLIC_API_URL } from "@env";
import { Beer, CollectionBeer, UserBeer } from "../Models/SQLData";
import { BeerProps } from "../props";
import {
  fetchBeer,
  fetchCollection,
  fetchCollectionBeersByBeerId,
  fetchUserBeer,
} from "../Models/Requests";
import { auth } from "../Models/firebase";
import { BackgroundColor, TryLikeButtonColor } from "../Styles/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import { images } from "../Constants";

const BeerScreen = (props: BeerProps) => {
  const [beer, setBeer] = useState({} as Beer | undefined);
  const [userBeer, setUserBeer] = useState({} as UserBeer | undefined);
  const [collectionId, setCollectionId] = useState<number | undefined>(
    undefined,
  );
  const [tried, setTried] = useState(false);
  const [liked, setLiked] = useState(false);
  const [collectionNames, setCollectionNames] = useState([] as string[]);

  const customShare = async () => {
    const beerUrl = Linking.createURL("beer", {
      queryParams: {
        id: `${beer?.id}`,
      },
    });
    const beerImageUri = Image.resolveAssetSource(images.BeerIcon).uri;
    const shareOptions = {
      title: 'Check out this beer on Beerpassport!',
      message: `I found this amazing beer on Beerpassport: ${beer?.name}. 🍻\n\nDiscover more about it here: ${beerUrl}\n\nCheers!`,
      urls: beerUrl,
    };
    try {
      const shareResponse = await Share.share(shareOptions);
      if (shareResponse.action === Share.sharedAction) {
        if (shareResponse.activityType) {
          console.log(
            "Shared with activity type of: ",
            shareResponse.activityType,
          );
        } else {
          console.log("shared");
        }
      } else if (shareResponse.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (err) {
      console.log("Error => ", err);
    }
  };

  const handleTriedPress = async () => {
    try {
      const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/`;
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
      const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/`;
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
      const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/`;
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
      const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/${userBeer?.beer_id}`;
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
            <Text style={styles.title} maxFontSizeMultiplier={1.2}>
              {beer.name}
            </Text>
            <Text style={styles.breweryTitle} maxFontSizeMultiplier={1.2}>
              {beer?.brewery?.name}
            </Text>
          </View>
          <View style={styles.interactives}>
            {!tried && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleTriedPress}
              >
                <Ionicons name="checkbox-outline" size={24} color="#00FFFF" />
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  {" "}
                  Try{" "}
                </Text>
              </TouchableOpacity>
            )}
            {tried && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleUnTriedPress}
              >
                <Ionicons name="checkbox" size={24} color="#00FFFF" />
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  {" "}
                  Try{" "}
                </Text>
              </TouchableOpacity>
            )}
            {!liked && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleLikedPress}
              >
                <Entypo name="star-outlined" size={24} color="gold" />
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  {" "}
                  Like{" "}
                </Text>
              </TouchableOpacity>
            )}
            {liked && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleUnLikedPress}
              >
                <Entypo name="star" size={24} color="gold" />
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  {" "}
                  Like{" "}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={customShare}>
              <MaterialIcons name="ios-share" size={24} color="black" />
              <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                {" "}
                Share{" "}
              </Text>
            </TouchableOpacity>
          </View>
          {beer.style && (
            <View style={styles.styleContainer}>
              <Text style={styles.style} maxFontSizeMultiplier={1.2}>
                {beer.style.style_name}
              </Text>
            </View>
          )}
          {(beer.abv || beer.abv === 0) && (
            <View style={styles.abvContainer}>
              <Text style={styles.abv} maxFontSizeMultiplier={1.2}>
                ABV: {beer.abv}
              </Text>
            </View>
          )}
          {!!beer.descript && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} maxFontSizeMultiplier={1.2}>
                {beer.descript}
              </Text>
            </View>
          )}
          <View style={styles.breweryContainer}>
            {collectionNames.length > 0 && (
              <Text style={styles.brewery} maxFontSizeMultiplier={1.2}>
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
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  interactives: {
    flexDirection: "row", // Align children in a row
    justifyContent: "center", // Center children horizontally
    alignItems: "center", // Center children vertically
    flexWrap: "wrap", // Allow wrapping if needed
    margin: 10, // Optional: Adjust margin as needed
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
  button: {
    backgroundColor: TryLikeButtonColor,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    width: "32%",
    textAlign: "center",
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center icon and text vertically
    padding: 10,
    margin: 5, // Space between buttons
    borderRadius: 5,
  },
  buttonText: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
