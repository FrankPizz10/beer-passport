import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { fetchNotifications } from "../Models/Requests";
import { Notification } from "../Models/SQLData";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([] as Notification[]);

  useEffect(() => {
    const getNotificationData = async () => {
      await fetchNotifications()
        .then((data) => setNotifications(data))
        .catch((error) => console.log(error));
    };
    getNotificationData();
  }, []);

  return (
    <SafeAreaView>
      <Text>NotificationsScreen</Text>
      <ScrollView>
        {notifications?.map((notification) => {
          return (
            <View key={notification.id}>
              <TouchableOpacity>
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
