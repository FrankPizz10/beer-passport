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
import { BackgroundColor } from "../Styles/colors";

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
    <>
      <View style={styles.container}>
        <Text style={styles.ScreenTitle}>Notifications</Text>
      </View>
      <ScrollView style={styles.notificationContainer}>
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
    </>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    flexGrow: 1,
    backgroundColor: BackgroundColor,
  },
  notification: {
    backgroundColor: BackgroundColor,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
    height: 60,
    justifyContent: "center",
    borderRadius: 5,
  },
  container: {
    backgroundColor: BackgroundColor,
    height: 80,
    justifyContent: "center",
  },
  ScreenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
});

export default NotificationsScreen;
