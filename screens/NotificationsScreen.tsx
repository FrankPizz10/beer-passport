import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { fetchNotifications, fetchUserByUserName } from "../Models/Requests";
import { Notification } from "../Models/SQLData";
import { NotificationsProps } from "../props";
import { useNavigation } from "@react-navigation/core";

const NotificationsScreen = (props: NotificationsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [notifications, setNotifications] = useState([] as Notification[]);

  useEffect(() => {
    const getNotificationData = async () => {
      await fetchNotifications()
        .then((data) => setNotifications(data))
        .catch((error) => console.log(error));
    };
    getNotificationData();
  }, []);

  const handleFriendPress = async (notificationId: number) => {
    const notification = notifications.find(
      (notification) => notification.id === notificationId
    );
    const user = await fetchUserByUserName(
      notification?.message.split(" ")[0]!
    );
    console.log(user);
    navigation.navigate("FriendProfile", {
      friend_id: user.id,
    });
  };

  return (
    <SafeAreaView>
      <Text>NotificationsScreen</Text>
      <ScrollView>
        {notifications?.map((notification) => {
          return (
            <View key={notification.id}>
              <TouchableOpacity
                onPress={() => handleFriendPress(notification.id)}
              >
                <Text>{notification.message}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
