import React, { useState, useEffect } from "react";
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

const FriendScreen = (props: FriendsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friends, setFriends] = useState([] as User[]);

  useEffect(() => {
    const getFriendsData = async () => {
      const friendsData = await fetchFriends(props.route.params.user_id);
      const friends = friendsData.map((friend) => {
        return friend.users_friends_user_2Tousers;
      });
      setFriends(friends);
    };
    getFriendsData();
  }, []);

  return (
    <SafeAreaView>
      <Text style={styles.ScreenTitle}>My Friends</Text>
      <AddFriendsButton
        navigation={navigation}
        user_id={props.route.params.user_id}
      />
      <ScrollView>
        {friends.map((friend) => {
          return (
            <View key={friend.id} style={styles.beerCard}>
              <TouchableOpacity>
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
  container: {
    flex: 1,
    marginTop: 10,
  },
  ScreenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
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
});

export default FriendScreen;
