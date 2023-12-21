import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CategoryScreen from "./screens/CategoryScreen";
import BeerScreen from "./screens/BeerScreen";
import CreatNewAccount from "./screens/CreateNewAccount";
import { RootStackParamList, RouterProps } from "./props";
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
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#C8102E" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
          headerTitleAlign: "center",
          headerTitle: "Beer Passport",
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
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
            headerStyle: { backgroundColor: "#C8102E" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
            headerTitleAlign: "center",
            headerTitle: "Beer Passport",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
