import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { YourBeersProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { useYourBeers } from "../Controllers/YourBeersController";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";
import { standardStyles } from "../Styles/styles";
import SimpleCard from "../components/SimpleCard";

const YourBeersScreen = (props: YourBeersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [tried, setTried] = useState(true);
  const [liked, setLiked] = useState(false);

  const { triedBeers, likedBeers } = useYourBeers(undefined);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const handleTriedPress = () => {
    setTried(true);
    setLiked(false);
  };

  const handleLikedPress = () => {
    setTried(false);
    setLiked(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} maxFontSizeMultiplier={1.2}>
          My Beers
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...(tried ? styles.clickedFilterButton : {}),
          }}
          onPress={handleTriedPress}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(tried ? styles.clickedButtonText : {}),
            }}
            maxFontSizeMultiplier={1.2}
          >
            Tried
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...(liked ? styles.clickedFilterButton : {}),
          }}
          onPress={handleLikedPress}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(liked ? styles.clickedButtonText : {}),
            }}
            maxFontSizeMultiplier={1.2}
          >
            Liked
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tried &&
          triedBeers?.map((beer) => {
            return (
              <SimpleCard
                key={beer.id}
                item={beer}
                handleCardPress={handleBeerPress}
              />
            );
          })}
        {tried && triedBeers?.length === 0 && (
          <View style={standardStyles.basicCard}>
            <Text
              style={standardStyles.basicCardText}
              maxFontSizeMultiplier={1.2}
            >
              You have no tried beers yet!
            </Text>
          </View>
        )}
        {liked &&
          likedBeers?.map((beer) => {
            return (
              <SimpleCard
                key={beer.id}
                item={beer}
                handleCardPress={handleBeerPress}
              />
            );
          })}
        {liked && likedBeers?.length === 0 && (
          <View style={standardStyles.basicCard}>
            <Text
              style={standardStyles.basicCardText}
              maxFontSizeMultiplier={1.2}
            >
              You have no liked beers yet!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default YourBeersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    margin: 10,
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
    fontSize: Dimensions.get("window").width * 0.05,
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
