import React, { useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { User } from "../Models/SQLData";
import { fetchFriends } from "../Models/Requests";
import { FriendsProps } from "../props";
import SearchUsersButton from "./SearchUsersButton";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import { BackgroundColor } from "../Styles/colors";
import SimpleCard from "../components/SimpleCard";

const FriendScreen = (props: FriendsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friends, setFriends] = useState([] as User[]);

  useFocusEffect(
    useCallback(() => {
      const getFriendsData = async () => {
        const friendsData = await fetchFriends();
        const friends = friendsData.map((friend) => {
          return friend.users_friends_user_2Tousers;
        });
        setFriends(friends);
      };
      getFriendsData();
    }, []),
  );

  const handleFriendPress = (friendId: number) => {
    navigation.navigate("FriendProfile", {
      friend_id: friendId,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.screenTitle} maxFontSizeMultiplier={1.2}>
        My Friends
      </Text>
      <SearchUsersButton navigation={navigation} />
      <ScrollView style={styles.friendContainer}>
        {friends.map((friend) => {
          return (
            <SimpleCard
              key={friend.id}
              item={{
                id: friend.id,
                name: friend.user_name,
              }}
              handleCardPress={handleFriendPress}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    margin: 15,
    padding: 15,
  },
  screenTitle: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  friendContainer: {
    flex: 1,
    alignContent: "center",
    width: Dimensions.get("window").width - 20,
    marginBottom: 20,
  },
});

export default FriendScreen;
