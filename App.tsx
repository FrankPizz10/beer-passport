import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CategoryScreen from "./screens/CategoryScreen";
import BeerScreen from "./screens/BeerScreen";
import CreatNewAccount from "./screens/CreateNewAccount";
import { RootStackParamList } from "./props";
import YourBeersScreen from "./screens/YourBeersScreen";
import SearchBeers from "./screens/SearchBeers";
import YourBadgesScreen from "./screens/YourBadgesScreen";
import AllCollectionsScreen from "./screens/AllCollectionsScreen";
import CollectionScreen from "./screens/CollectionScreen";
import FriendScreen from "./screens/FriendScreen";
import AddFriendsScreen from "./screens/AddFriendsScreen";
import OtherUserScreen from "./screens/OtherUserScreen";
import { BottomTabNavigator } from "./screens/BottomTabNavigator";
import SearchUsersScreen from "./screens/SearchUsersScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccountScreen from "./screens/AccountScreen";
import * as Notifications from "expo-notifications";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { MainHighlightColor } from "./Styles/colors";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <Text style={styles.headerTitle}>BEER PASSPORT</Text>
    </SafeAreaView>
  );
};

const CustomHeaderWithBack = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{ position: "relative", left: -20 }}
      >
        <AntDesign name="left" size={30} color="white" />
        <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>BEER PASSPORT</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: MainHighlightColor, // Your desired background color
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: () => <CustomHeaderWithBack />,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen name="CreateNewAccount" component={CreatNewAccount} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Beer" component={BeerScreen} />
        <Stack.Screen name="YourBeers" component={YourBeersScreen} />
        <Stack.Screen name="YourBadges" component={YourBadgesScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen name="Friends" component={FriendScreen} />
        {/* <Stack.Screen name="AddFriends" component={AddFriendsScreen} /> */}
        <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
        <Stack.Screen name="FriendProfile" component={OtherUserScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AllCollections" component={AllCollectionsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{
            header: () => <CustomHeader />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
