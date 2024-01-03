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
import { addFriend, fetchUserById, removeFriend } from "../Models/Requests";
import { useYourBeers } from "../Controllers/YourBeersController";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { decimalToPercent } from "../utils";
import { API_URL } from "@env";
import {
  BackgroundColor,
  MainButtonColor,
  MainHighlightColor,
} from "../Styles/colors";
import { auth } from "../Models/firebase";
import { standardStyles } from "../Styles/styles";

const OtherUserScreen = (props: FriendProfileProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [user, setUser] = useState<User>({} as User);
  const [triedPressed, setTriedPressed] = useState(true);
  const [likedPressed, setLikedPressed] = useState(false);
  const [badgesPressed, setBadgesPressed] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

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
    const getUserData = async () => {
      const friendData = await fetchUserById(props.route.params.friend_id);
      setUser(friendData);
    };
    const getFriendshipStatus = async () => {
      const url = `${API_URL}/api/friends/${props.route.params.friend_id}`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
    };
    getUserData();
    getFriendshipStatus();
  }, []);

  const { triedBeers, likedBeers } = useYourBeers(props.route.params.friend_id);

  const badges = useYourBadges(props.route.params.friend_id);

  const handleAddFriend = async () => {
    await addFriend(props.route.params.friend_id);
    setIsFriend(true);
  };

  const handleRemoveFriend = async () => {
    await removeFriend(props.route.params.friend_id);
    setIsFriend(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.detailsContainer}>
        <Text style={styles.friendName}>{user.user_name}</Text>
      </View>
      {isFriend && (
        <TouchableOpacity
          onPress={handleRemoveFriend}
          style={styles.friendButton}
        >
          <Text style={styles.friendButtonTitle}>Remove Friend</Text>
        </TouchableOpacity>
      )}
      {!isFriend && (
        <TouchableOpacity onPress={handleAddFriend} style={styles.friendButton}>
          <Text style={styles.friendButtonTitle}>Add Friend</Text>
        </TouchableOpacity>
      )}
      <View style={styles.buttonAndItemsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTriedPress}>
            <Text style={styles.friendButtonTitle}> Tried </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLikedPress}>
            <Text style={styles.friendButtonTitle}> Liked </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleBadgesPress}>
            <Text style={styles.friendButtonTitle}> Badges </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.friendBeersContainer}>
          {triedPressed &&
            triedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={standardStyles.basicCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          {triedPressed && triedBeers?.length === 0 && (
            <View style={standardStyles.basicCard}>
              <Text style={standardStyles.basicCardText}>{user.user_name} has no tried beers yet!</Text>
            </View>
          )}
          {likedPressed &&
            likedBeers?.map((beer) => {
              return (
                <View key={beer.id} style={standardStyles.basicCard}>
                  <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                    <Text>{beer.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          {likedPressed && likedBeers?.length === 0 && (
            <View style={standardStyles.basicCard}>
              <Text style={standardStyles.basicCardText}>{user.user_name} has no liked beers yet!</Text>
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
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  detailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    padding: 15,
  },
  friendName: {
    fontSize: 45,
    fontWeight: "bold",
  },
  friendButton: {
    alignItems: "center",
    backgroundColor: MainHighlightColor,
    borderRadius: 5,
    padding: 10,
    width: 150,
    margin: 15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  friendButtonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  button: {
    backgroundColor: MainHighlightColor,
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
    backgroundColor: MainButtonColor,
    borderRadius: 12,
    margin: 10,
    height: 150,
  },
});

export default OtherUserScreen;
