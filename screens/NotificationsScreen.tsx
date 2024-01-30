import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { fetchNotifications, fetchUserByUserName } from "../Models/Requests";
import { Notification, NotificationType } from "../Models/SQLData";
import { NotificationsProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { BackgroundColor } from "../Styles/colors";
import { useFocusEffect } from "@react-navigation/native";

const NotificationsScreen = (props: NotificationsProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [notifications, setNotifications] = useState([] as Notification[]);

  useFocusEffect(
    useCallback(() => {
      const getNotificationData = async () => {
        await fetchNotifications()
          .then((data) => setNotifications(data))
          .catch((error) => console.log(error));
      };
      getNotificationData();
    }, []),
  );

  const handleNotificationPress = async (notificationId: number) => {
    const notification = notifications.find(
      (notification) => notification.id === notificationId,
    );
    if (notification?.type === NotificationType.NEW_FRIEND) {
      const user = await fetchUserByUserName(
        notification?.message.split(" ")[0]!,
      );
      navigation.navigate("FriendProfile", {
        friend_id: user.id,
      });
    } else if (notification?.type === NotificationType.BADGE_EARNED) {
      navigation.navigate("YourBadges");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.ScreenTitle} maxFontSizeMultiplier={1.2}>
          Notifications
        </Text>
      </View>
      <ScrollView style={styles.notificationContainer}>
        {notifications?.map((notification) => {
          return (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification.id)}
              style={styles.notification}
            >
              <Text style={styles.message} maxFontSizeMultiplier={1.2}>
                {notification.message}
              </Text>
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
    minHeight: Dimensions.get("window").height / 15,
    justifyContent: "center",
    borderRadius: 5,
  },
  container: {
    backgroundColor: BackgroundColor,
    justifyContent: "center",
  },
  message: {
    fontSize: Dimensions.get("window").width / 22,
    textAlign: "center",
  },
  ScreenTitle: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
});

export default NotificationsScreen;
