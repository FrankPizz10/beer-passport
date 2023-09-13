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
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <Text style={styles.details}>FriendProfileScreen</Text>
        <Text style={styles.details}>{friend.user_name}</Text>
        <Text style={styles.details}>{friend.email}</Text>
        <Text style={styles.details}>{friend.age}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    fontSize: 20,
  },
});

export default FriendProfileScreen;
