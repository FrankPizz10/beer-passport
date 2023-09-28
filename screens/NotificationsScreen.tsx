import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
    navigation.navigate("FriendProfile", {
      friend_id: user.id,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
    >
      {notifications?.map((notification) => {
        return (
          <TouchableOpacity
            key={notification.id}
            onPress={() => handleFriendPress(notification.id)}
            style={styles.notification}
          >
            <Text>{notification.message}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  notification: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
    height: 60,
    justifyContent: "center",
  },
});

export default NotificationsScreen;
