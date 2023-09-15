import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { User } from "../Models/SQLData";
import { fetchFriends } from "../Models/Requests";
import { FriendsProps } from "../props";
import AddFriendsButton from "./AddFriendsButton";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";

const FriendScreen = (props: FriendsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friends, setFriends] = useState([] as User[]);

  useFocusEffect(
    React.useCallback(() => {
      const getFriendsData = async () => {
        const friendsData = await fetchFriends();
        const friends = friendsData.map((friend) => {
          return friend.users_friends_user_2Tousers;
        });
        setFriends(friends);
      };
      getFriendsData();
    }, [])
  );

  const handleFriendPress = (friendId: number) => {
    navigation.navigate("FriendProfile", {
      user_id: props.route.params.user_id,
      friend_id: friendId,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.screenTitle}>My Friends</Text>
      <AddFriendsButton
        navigation={navigation}
        user_id={props.route.params.user_id}
      />
      <ScrollView style={styles.friendContainer}>
        {friends.map((friend) => {
          return (
            <View key={friend.id} style={styles.friendCard}>
              <TouchableOpacity onPress={() => handleFriendPress(friend.id)}>
                <Text>{friend.user_name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  titleContainer: {
    height: 150,
    width: 400,
    alignItems: "center",
    margin: 15,
    padding: 15,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  friendContainer: {
    flex: 1,
    alignContent: "center",
    height: 400,
    width: 400,
    marginBottom: 20,
  },
  friendCard: {
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
});

export default FriendScreen;
