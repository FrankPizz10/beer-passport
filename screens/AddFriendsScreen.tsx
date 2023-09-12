import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { AddFriendsProps } from "../props";
import { User } from "../Models/SQLData";
import { useSearchFilter } from "../Controllers/SearchController";
import { addFriend, fetchAllUsers } from "../Models/Requests";

const AddFriendsScreen = (props: AddFriendsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [friends, setFriends] = useState([] as User[]);

  useEffect(() => {
    const getFriendsData = async () => {
      await fetchAllUsers()
        .then((data) =>
          setFriends(
            data.filter((user) => user.id !== props.route.params.user_id)
          )
        )
        .catch((error) => console.log(error));
    };
    getFriendsData();
  }, []);

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
    initialList: friends,
    nameKey: "user_name",
  });

  const handleAddFriend = async (friendId: number) => {
    await addFriend(friendId);
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.ScreenTitle}>Add Friends</Text>
      </View>
      <View>
        {/* Search Bar */}
        <TextInput
          style={styles.input}
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search for a user"
        />
        <ScrollView>
          {filteredList?.map((friend) => {
            return (
              <View key={friend.id} style={styles.beerCard}>
                <TouchableOpacity onPress={() => handleAddFriend(friend.id)}>
                  <Text>{friend.user_name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
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
  dropDown: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});

export default AddFriendsScreen;
