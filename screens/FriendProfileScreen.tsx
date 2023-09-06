import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { FriendProfileProps } from "../props";
import { User } from "../Models/SQLData";
import { fetchUserById } from "../Models/Requests";

const FriendProfileScreen = (props: FriendProfileProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friend, setFriend] = useState<User>({} as User);

  useEffect(() => {
    const getFriendData = async () => {
      const friendData = await fetchUserById(props.route.params.friend_id);
      setFriend(friendData);
    };
    getFriendData();
  }, []);

  return (
    <View>
      <Text>FriendProfileScreen</Text>
      <Text>{friend.user_name}</Text>
      <Text>{friend.email}</Text>
      <Text>{friend.age}</Text>
    </View>
  );
};

export default FriendProfileScreen;
