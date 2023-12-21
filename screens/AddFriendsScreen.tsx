import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { AddFriendsProps } from "../props";
import { User } from "../Models/SQLData";
import { useSearchFilter } from "../Controllers/SearchController";
import { addFriend } from "../Models/Requests";
import { API_URL } from "@env";
import { auth } from "../Models/firebase";
import { BackgroundColor } from "./colors";

const AddFriendsScreen = (props: AddFriendsProps) => {
  const [notfriends, setNotFriends] = useState([] as User[]);
  const [animation] = useState(() => new Animated.Value(0));
  const [friendAdded, setFriendAdded] = useState(false);

  const { height } = Dimensions.get("window");

  const display = animation.interpolate({
    inputRange: [0.2, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const success = animation.interpolate({
    inputRange: [1.1, 2],
    outputRange: [0, -height],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const getFriendScreenData = async () => {
      const url = `${API_URL}/api/notfriends/`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const notFriendsData = await response.json();
      setNotFriends(notFriendsData);
    };
    getFriendScreenData();
  }, [friendAdded]);

  const { searchInput, setSearchInput, filteredList } = useSearchFilter({
    initialList: notfriends,
    nameKey: "user_name",
  });

  const handleAddFriend = async (friendId: number) => {
    await addFriend(friendId);
    setFriendAdded(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
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
          placeholderTextColor="gray"
        />
        <ScrollView>
          {filteredList?.map((user) => {
            return (
              <View key={user.id} style={styles.beerCard}>
                <TouchableOpacity onPress={() => handleAddFriend(user.id)}>
                  <Text>{user.user_name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <Animated.View pointerEvents="box-none">
          <Animated.View
            style={[
              styles.animatedViewContainer,
              {
                transform: [
                  {
                    scale: display,
                  },
                  {
                    translateY: success,
                  },
                ],
              },
            ]}
          >
            <View style={styles.animatedViewContent}>
              <Text>Friend Added!</Text>
              <View style={styles.animatedViewContent}>
                <TouchableOpacity
                  onPress={() => {
                    Animated.spring(animation, {
                      toValue: 0,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <Text style={styles.buttonClose}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
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
    backgroundColor: BackgroundColor,
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
  buttonClose: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  animatedViewContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BackgroundColor,
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
  animatedViewContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddFriendsScreen;
