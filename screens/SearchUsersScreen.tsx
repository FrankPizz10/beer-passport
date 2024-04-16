import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SearchUsersProps } from "../props";
import { User } from "../Models/SQLData";
import { useSearchFilter } from "../Controllers/SearchController";
import { fetchAllUsers } from "../Models/Requests";
import { BackgroundColor } from "../Styles/colors";
import { getUser } from "./HomeScreen";
import SimpleCard from "../components/SimpleCard";

const SearchUsersScreen = (props: SearchUsersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [users, setUsers] = useState([] as User[]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await fetchAllUsers();
      const cur_user = await getUser();
      setUsers(users.filter((user) => user.id !== cur_user?.id));
    };
    getAllUsers();
  }, []);

  const filteredUserList = useSearchFilter({
    searchInput,
    initialList: users,
    nameKey: "user_name",
    defaultResults: [],
  });

  const handleUserPress = async (userId: number) => {
    navigation.navigate("FriendProfile", {
      friend_id: userId,
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <TextInput
          style={styles.input}
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search for a user"
          placeholderTextColor="gray"
        />
      </TouchableWithoutFeedback>
      <ScrollView>
        {filteredUserList?.map((user) => {
          return (
            <SimpleCard
              key={user.id}
              item={{
                id: user.id,
                name: user.user_name,
              }}
              handleCardPress={handleUserPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  input: {
    height: Dimensions.get("window").height / 20,
    fontSize: Dimensions.get("window").width / 25,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
  },
});

export default SearchUsersScreen;
