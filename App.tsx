import React, { useEffect } from "react";
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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Beer" component={BeerScreen} />
        <Stack.Screen name="CreateNewAccount" component={CreatNewAccount} />
        <Stack.Screen name="YourBeers" component={YourBeersScreen} />
        <Stack.Screen name="SearchBeers" component={SearchBeers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
