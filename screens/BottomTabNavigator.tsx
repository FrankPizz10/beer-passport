import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../props";
import HomeScreen from "./HomeScreen";
import SearchBeers from "./SearchBeers";
import AllCollectionsScreen from "./AllCollectionsScreen";
import NotificationsScreen from "./NotificationsScreen";

const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
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
        name="AllCollections"
        component={AllCollectionsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
