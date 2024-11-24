import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import CategoryScreen from "./screens/CategoryScreen";
import BeerScreen from "./screens/BeerScreen";
import CreatNewAccount from "./screens/CreateNewAccount";
import { RootStackParamList } from "./props";
import YourBeersScreen from "./screens/YourBeersScreen";
import YourBadgesScreen from "./screens/YourBadgesScreen";
import AllCollectionsScreen from "./screens/AllCollectionsScreen";
import CollectionScreen from "./screens/CollectionScreen";
import FriendScreen from "./screens/FriendScreen";
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
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BreweryScreen from "./screens/BreweryScreen";
import { AuthProvider } from "./Controllers/AuthContext";
import { DeepLinkProvider } from "./Controllers/DeepLinkContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const linking = {
  prefixes: ["beerpassport://", "https://web.beer-passport.com/"],
  config: {
    screens: {
      Beer: "beers/:id",
    },
  },
};

const CustomHeader = () => {
  const screenHeight = Dimensions.get("window").height;
  const headerHeight = screenHeight * 0.155;
  return (
    <SafeAreaView style={{ ...styles.headerContainer, height: headerHeight }}>
      <Text style={styles.headerTitle} maxFontSizeMultiplier={1}>
        BEER PASSPORT
      </Text>
    </SafeAreaView>
  );
};

const CustomHeaderWithBack = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const headerHeight = screenHeight * 0.15;
  const backButtonPositionTop = headerHeight * 0.5;
  const backButtonPositionLeft = screenWidth * 0.03;
  return (
    <SafeAreaView style={{ ...styles.headerContainer, height: headerHeight }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: backButtonPositionLeft,
          top: backButtonPositionTop,
        }}
      >
        <AntDesign name="left" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} maxFontSizeMultiplier={1}>
        BEER PASSPORT
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: MainHighlightColor, // Your desired background color
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: Dimensions.get("window").width * 0.09,
    fontWeight: "bold",
    color: "white",
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <DeepLinkProvider>
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
            <Stack.Screen name="Brewery" component={BreweryScreen} />
            <Stack.Screen name="YourBeers" component={YourBeersScreen} />
            <Stack.Screen name="YourBadges" component={YourBadgesScreen} />
            <Stack.Screen name="Collection" component={CollectionScreen} />
            <Stack.Screen name="Friends" component={FriendScreen} />
            <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
            <Stack.Screen name="FriendProfile" component={OtherUserScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="AllCollections"
              component={AllCollectionsScreen}
            />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              options={{
                header: () => <CustomHeader />,
              }}
            />
          </Stack.Navigator>
        </DeepLinkProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
