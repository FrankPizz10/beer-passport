import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { FriendProfileProps } from "../props";
import { User } from "../Models/SQLData";
import { addFriend, fetchUserById, removeFriend } from "../Models/Requests";
import { useYourBeers } from "../Controllers/YourBeersController";
import { useYourBadges } from "../Controllers/YourBadgesController";
import { EXPO_PUBLIC_API_URL } from "@env";
import {
  BackgroundColor,
  MainButtonColor,
  MainHighlightColor,
} from "../Styles/colors";
import { auth } from "../Models/firebase";
import { standardStyles } from "../Styles/styles";
import Badge from "../components/Badge";
import SimpleCard from "../components/SimpleCard";

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

  const handleBadgePress = (collectionId: number) => {
    navigation.navigate("Collection", {
      collection_id: collectionId,
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
      const url = `${EXPO_PUBLIC_API_URL}/api/friends/${props.route.params.friend_id}`;
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
        <Text style={styles.friendName} maxFontSizeMultiplier={1.2}>
          {user.user_name}
        </Text>
      </View>
      {isFriend && (
        <TouchableOpacity
          onPress={handleRemoveFriend}
          style={styles.friendButton}
        >
          <Text style={styles.friendButtonTitle} maxFontSizeMultiplier={1.2}>
            Remove Friend
          </Text>
        </TouchableOpacity>
      )}
      {!isFriend && (
        <TouchableOpacity onPress={handleAddFriend} style={styles.friendButton}>
          <Text style={styles.friendButtonTitle} maxFontSizeMultiplier={1.2}>
            Add Friend
          </Text>
        </TouchableOpacity>
      )}
      {isFriend && (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{
                ...styles.button,
                ...(triedPressed ? styles.clickedFilterButton : {}),
              }}
              onPress={handleTriedPress}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  ...(triedPressed ? styles.clickedButtonText : {}),
                }}
                maxFontSizeMultiplier={1.1}
              >
                Tried
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                ...(likedPressed ? styles.clickedFilterButton : {}),
              }}
              onPress={handleLikedPress}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  ...(likedPressed ? styles.clickedButtonText : {}),
                }}
                maxFontSizeMultiplier={1.1}
              >
                Liked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                ...(badgesPressed ? styles.clickedFilterButton : {}),
              }}
              onPress={handleBadgesPress}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  ...(badgesPressed ? styles.clickedButtonText : {}),
                }}
                maxFontSizeMultiplier={1.1}
              >
                Badges
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollables}>
            {triedPressed &&
              triedBeers?.map((beer) => {
                return (
                  <SimpleCard
                    key={beer.id}
                    item={beer}
                    handleCardPress={handleBeerPress}
                  />
                );
              })}
            {triedPressed && triedBeers?.length === 0 && (
              <View style={standardStyles.basicCard}>
                <Text
                  style={standardStyles.basicCardText}
                  maxFontSizeMultiplier={1.2}
                >
                  {user.user_name} has no tried beers yet!
                </Text>
              </View>
            )}
            {likedPressed &&
              likedBeers?.map((beer) => {
                return (
                  <SimpleCard
                    key={beer.id}
                    item={beer}
                    handleCardPress={handleBeerPress}
                  />
                );
              })}
            {likedPressed && likedBeers?.length === 0 && (
              <View style={standardStyles.basicCard}>
                <Text
                  style={standardStyles.basicCardText}
                  maxFontSizeMultiplier={1.2}
                >
                  {user.user_name} has no liked beers yet!
                </Text>
              </View>
            )}
            {badgesPressed &&
              badges &&
              badges?.map((badge) => {
                return (
                  <Badge
                    key={badge.id}
                    badge={badge}
                    handleBadgePress={handleBadgePress}
                  />
                );
              })}
            {badgesPressed && badges?.length === 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeTitle} maxFontSizeMultiplier={1.2}>
                  No badges yet!
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
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
    padding: 10,
    marginTop: 5,
  },
  friendName: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
  },
  friendButton: {
    alignItems: "center",
    backgroundColor: MainHighlightColor,
    borderRadius: 5,
    padding: 10,
    width: Dimensions.get("window").width - 80,
    margin: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  friendButtonTitle: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    width: "100%",
  },
  button: {
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: "27%",
    height: 50,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: Dimensions.get("window").width / 18,
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
  scrollables: {
    width: "95%",
  },
  buttonText: {
    fontSize: Dimensions.get("window").width * 0.05,
    textAlign: "center",
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

export default OtherUserScreen;
