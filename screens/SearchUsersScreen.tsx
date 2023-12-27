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
  });

  const handleUserPress = async (userId: number) => {
    navigation.navigate("FriendProfile", {
      friend_id: userId,
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.ScreenTitle}>Find Users</Text>
      </View>
      <View>
        {/* Search Bar */}
        <TextInput
          style={styles.input}
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search for a user"
          placeholderTextColor="gray"
        />
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
  root: {
    backgroundColor: BackgroundColor,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  ScreenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
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

export default SearchUsersScreen;
