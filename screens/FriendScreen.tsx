import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { User } from "../Models/SQLData";
import { fetchFriends } from "../Models/Requests";
import { FriendsProps } from "../props";

const FriendScreen = (props: FriendsProps) => {
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
    <View>
      <Text>Friend Screen</Text>
      <ScrollView>
        {friends.map((friend) => {
          return (
            <View key={friend.id}>
              <Text>{friend.user_name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FriendScreen;
