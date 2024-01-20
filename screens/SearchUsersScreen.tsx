import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import { standardStyles } from "../Styles/styles";

const SearchUsersScreen = (props: SearchUsersProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [users, setUsers] = useState([] as User[]);

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await fetchAllUsers();
      const cur_user = await getUser();
      setUsers(users.filter((user) => user.id !== cur_user?.id));
    };
    getAllUsers();
  }, []);

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
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
      <View>
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
          {filteredList?.map((user) => {
            return (
              <View key={user.id} style={standardStyles.basicCard}>
                <TouchableOpacity onPress={() => handleUserPress(user.id)}>
                  <Text style={standardStyles.basicCardText}>
                    {user.user_name}
                  </Text>
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
    backgroundColor: BackgroundColor,
  },
  ScreenTitle: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    height: Dimensions.get("window").height / 15,
    fontSize: Dimensions.get("window").width / 25,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
});

export default SearchUsersScreen;
