import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { HomeProps } from "../props";
import { User } from "../Models/SQLData";
import { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_EXPO_PROJECT_ID } from "@env";
import {
  BackgroundColor,
  MainButtonColor,
  MainHighlightColor,
  TitleColor,
} from "../Styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { isUser } from "../utils";
import { sendEmailVerification } from "firebase/auth";
import { Button, ButtonText } from "@/components/ui/button";

export const getUser = async (): Promise<User | undefined> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/userbyuid`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const cur_user = await response.json();
    if (!isUser(cur_user)) {
      return undefined;
    }
    return cur_user;
  } catch (error) {
    console.log("GetUserError", error);
  }
};

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return;
    }
  }
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: EXPO_PUBLIC_EXPO_PROJECT_ID,
    })
  ).data;
  return token;
}

const sendPushTokenToServer = async (notificationToken: string) => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/notification-token`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ pushToken: notificationToken }),
    });
    await response.json();
  } catch (error) {
    console.log("SendPushTokenToServerError", error);
  }
};

const HomeScreen = (props: HomeProps) => {
  const [user, setUser] = useState({} as User | undefined);
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [badgeCount, setBadgeCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleCollectionsScreen = () => {
    navigation.navigate("AllCollections");
  };

  useEffect(() => {
    const getUserData = async () => {
      const cur_user = await getUser();
      setUser(cur_user);
    };
    getUserData();
    if (auth.currentUser && auth.currentUser.emailVerified) {
      setEmailVerified(true);
    }
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) sendPushTokenToServer(token);
      })
      .catch((error) => console.error("Error obtaining push token:", error));
  }, []);

  useFocusEffect(() => {
    const getBadgeCount = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/userbadges/completedcount`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const { badgeCount } = await response.json();
        setBadgeCount(badgeCount);
      } catch (error) {
        console.log("GetBadgeCountError", error);
      }
    };
    getBadgeCount();
    const getLikedAndTriedBeersCount = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/userbeers/count`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const { likedBeersCount, triedBeersCount } = await response.json();
        setLikedCount(likedBeersCount);
        setTriedCount(triedBeersCount);
      } catch (error) {
        console.log("GetLikedAndTriedBeersCountError", error);
      }
    };
    getLikedAndTriedBeersCount();
  });

  const handleVerifyEmail = async () => {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser);
      setEmailSent(true);
    }
  };

  const closeModal = () => {
    setEmailVerified(true);
  };

  return (
    <>
      <SafeAreaView style={styles.root}>
        <View style={styles.titleContainer}>
          <Text style={styles.welcome} maxFontSizeMultiplier={1.1}>
            Welcome {user?.user_name}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="beer-outline" size={80} color="gold" />
        </View>
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
            You have completed {badgeCount}{" "}
            {badgeCount === 1 ? "badge" : "badges"}!
          </Text>
          <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
            You have tried {triedCount} {triedCount === 1 ? "beer" : "beers"}!
          </Text>
          <Text style={styles.userDetails} maxFontSizeMultiplier={1.2}>
            You have liked {likedCount} {likedCount === 1 ? "beer" : "beers"}!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            onPress={handleCollectionsScreen}
            style={styles.button}
          >
            <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
              Collections
            </Text>
          </TouchableOpacity> */}
          <Button className="bg-sky-500 w-full my-2 p-2" onPress={handleCollectionsScreen}>
            <ButtonText className="text-white font-bold text-center">Collections</ButtonText>
          </Button>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("YourBadges");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
              My Badges
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {!emailVerified && (
        <Modal
          animationType="none"
          transparent
          visible={!emailVerified}
          onRequestClose={closeModal}
        >
          {!emailSent ? (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.modalMessage}>
                  Please verify your email to help with account recovery.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleVerifyEmail}
                >
                  <Text style={styles.modalButtonText}>Verify Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.confirmationMessage}>Email Sent!</Text>
              </View>
            </View>
          )}
        </Modal>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  welcome: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
    color: TitleColor,
    paddingTop: 10,
  },
  userDetailsContainer: {
    alignItems: "center",
    padding: 15,
  },
  userDetails: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: MainButtonColor,
    color: "white",
    height: Dimensions.get("window").height / 12,
    padding: 10,
    margin: 10,
    width: Dimensions.get("window").width - 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: Dimensions.get("window").height / 100,
    right: Dimensions.get("window").width / 50,
    width: Dimensions.get("window").width / 12,
    height: Dimensions.get("window").width / 12,
    borderRadius: 20,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: Dimensions.get("window").width / 25,
    color: "white",
  },
  modalButton: {
    backgroundColor: MainHighlightColor,
    color: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: Dimensions.get("window").width / 22,
    color: "white",
    fontWeight: "bold",
  },
  confirmationMessage: {
    fontSize: Dimensions.get("window").width / 18,
    padding: 15,
  },
  modalMessage: {
    fontSize: Dimensions.get("window").width / 20,
    padding: 15,
  },
});
