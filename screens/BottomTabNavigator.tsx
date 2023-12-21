import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../props";
import HomeScreen from "./HomeScreen";
import SearchBeers from "./SearchBeers";
import NotificationsScreen from "./NotificationsScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import ProfileScreen from "./ProfileScreen";
import { useState, useEffect } from "react";
import { auth } from "../Models/firebase";
import { API_URL } from "@env";
import { View, Text, TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabNavigator = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationIds, setNotificationIds] = useState([]);

  useEffect(() => {
    const getUnViewedNotifications = async () => {
      try {
        const url = `${API_URL}/api/notifications/unviewed`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const { unViewedCount, unViewedIds } = await response.json();
        setNotificationCount(unViewedCount);
        setNotificationIds(unViewedIds);
      } catch (error) {
        console.log("GetNotificationsError", error);
      }
    };

    // // Update notifications every 5 seconds (adjust the interval as needed)
    // const intervalId = setInterval(() => {
    //   getUnViewedNotifications();
    // }, 5000);

    // // Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);

    getUnViewedNotifications();
  }, []);

  const handleNotificationsPress = () => {
    const updateUnViewedNotifications = async () => {
      try {
        const url = `${API_URL}/api/notifications/view`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ notificationIds: notificationIds }),
        });
        if (response.status === 200) {
          setNotificationCount(0);
        }
      } catch (error) {
        console.log("GetNotificationsError", error);
      }
    };
    updateUnViewedNotifications();
  };

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
            return (
              <>
                <Ionicons name="notifications" size={24} color={color} />
                {notificationCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: 30,
                      top: 0,
                      backgroundColor: "red",
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>
                      {notificationCount}
                    </Text>
                  </View>
                )}
              </>
            );
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
        listeners={{
          tabPress: (e) => {
            handleNotificationsPress();
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
