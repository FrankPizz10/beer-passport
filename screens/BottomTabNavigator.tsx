import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../props";
import HomeScreen from "./HomeScreen";
import SearchBeers from "./SearchBeers";
import AllCollectionsScreen from "./AllCollectionsScreen";
import NotificationsScreen from "./NotificationsScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          color = focused ? "blue" : "black";
          if (route.name === "Home") {
            return <Entypo name="home" size={24} color={color} />;
          } else if (route.name === "SearchBeers") {
            return <FontAwesome5 name="search" size={24} color={color} />;
          } else if (route.name === "Notifications") {
            return <Ionicons name="notifications" size={24} color={color} />;
          } else if (route.name === "Profile") {
            return <MaterialIcons name="person" size={28} color={color} />;
          }
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="SearchBeers"
        component={SearchBeers}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
