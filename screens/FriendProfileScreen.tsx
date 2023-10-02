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
import { User } from "../Models/SQLData";
import { fetchUserById } from "../Models/Requests";
import { useYourBeers } from "../Controllers/YourBeersController";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { decimalToPercent } from "../utils";

const FriendProfileScreen = (props: FriendProfileProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friend, setFriend] = useState<User>({} as User);
  const [triedPressed, setTriedPressed] = useState(true);
  const [likedPressed, setLikedPressed] = useState(false);
  const [badgesPressed, setBadgesPressed] = useState(false);

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  const handleTriedPress = () => {
    setTriedPressed(true);
    setLikedPressed(false);
    setBadgesPressed(false);
  };

  const handleLikedPress = () => {
    setTriedPressed(false);
    setLikedPressed(true);
    setBadgesPressed(false);
  };

  const handleBadgesPress = () => {
    setTriedPressed(false);
    setLikedPressed(false);
    setBadgesPressed(true);
  };

  useEffect(() => {
    const getFriendData = async () => {
      const friendData = await fetchUserById(props.route.params.friend_id);
      setFriend(friendData);
    };
    getFriendData();
  }, []);

  const { triedBeers, likedBeers } = useYourBeers(props.route.params.friend_id);

  const badges = useYourBadges(props.route.params.friend_id);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.detailsContainer}>
        <Text style={styles.friendName}>{friend.user_name}</Text>
      </View>
      <View style={styles.buttonAndItemsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
            <Text> Tried </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
            <Text> Liked </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleBadgesPress}>
            <Text> Badges </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.friendBeersContainer}>
          {triedPressed &&
            triedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={styles.beerCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          {triedPressed && triedBeers?.length === 0 && (
            <View style={styles.beerCard}>
              <Text>{friend.user_name} has no tried beers yet!</Text>
            </View>
          )}
          {likedPressed &&
            likedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={styles.beerCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          {likedPressed && likedBeers?.length === 0 && (
            <View style={styles.beerCard}>
              <Text>{friend.user_name} has no liked beers yet!</Text>
            </View>
          )}
          {badgesPressed &&
            badges &&
            badges?.map((badge) => {
              return (
                <View key={badge.id} style={styles.badge}>
                  <Text style={styles.badgeTitle}>
                    {badge.collections.name.toUpperCase()}
                  </Text>
                  <Text>{badge.collections.description}</Text>
                  <Text>Difficulty: {badge.collections.difficulty}</Text>
                  <Text>Progress: {decimalToPercent(badge.progress)}</Text>
                </View>
              );
            })}
          {badgesPressed && badges?.length === 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTitle}>No badges yet!</Text>
            </View>
          )}
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
  badgeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5722",
    borderRadius: 12,
    margin: 10,
    height: 150,
  },
});

export default FriendProfileScreen;
