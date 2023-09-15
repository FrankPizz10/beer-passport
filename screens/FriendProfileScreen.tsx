import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { FriendProfileProps } from "../props";
import { Beer, User } from "../Models/SQLData";
import { fetchUserById } from "../Models/Requests";
import { useYourBeers } from "../Controllers/YourBeersController";

const FriendProfileScreen = (props: FriendProfileProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friend, setFriend] = useState<User>({} as User);
  const [tried, setTried] = useState(true);
  const [liked, setLiked] = useState(false);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      user_id: props.route.params.user_id,
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

  useEffect(() => {
    const getFriendData = async () => {
      const friendData = await fetchUserById(props.route.params.friend_id);
      setFriend(friendData);
    };
    getFriendData();
  }, []);

  const { triedBeers, likedBeers } = useYourBeers(props.route.params.friend_id);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.detailsContainer}>
        <Text style={styles.friendName}>{friend.user_name}</Text>
        <Text style={styles.details}>Email: {friend.email}</Text>
        <Text style={styles.details}>Age: {friend.age}</Text>
      </View>
      <View style={styles.buttonAndItemsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
            <Text> Tried </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
            <Text> Liked </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.friendBeersContainer}>
          {tried &&
            triedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={styles.beerCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          {liked &&
            likedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={styles.beerCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  detailsContainer: {
    alignItems: "center",
    margin: 20,
  },
  friendName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 22,
    marginBottom: 5,
  },
  buttonAndItemsContainer: {
    flex: 1,
    alignItems: "center",
  },
  friendBeersContainer: {
    flex: 1,
    alignContent: "center",
    height: 400,
    width: 400,
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
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
});

export default FriendProfileScreen;
