import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { auth } from "../Models/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { LoginProps } from "../props";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";
import { checkUserExists } from "./CreateNewAccount";
import { checkServerConnected } from "../Models/Requests";
import { getErrorMessage } from "../utils";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = (props: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPressed, setLoginPressed] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    const tryStoredLogin = async () => {
      try {
        const serverConnected = await checkServerConnected();
        setServerConnected(serverConnected);
        const user = await ReactNativeAsyncStorage.getItem("user");
        const userJson: User = user ? JSON.parse(user) : undefined;
        const userExists = userJson
          ? await checkUserExists(userJson.email!, "_")
          : undefined;
        onAuthStateChanged(auth, (user) => {
          if (user && serverConnected && userExists) {
            navigation.replace("BottomTabNavigator");
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    tryStoredLogin();
  }, []);

  useEffect(() => {
    const unsibscribe = onAuthStateChanged(auth, (user) => {
      if (user && serverConnected && userExists) {
        ReactNativeAsyncStorage.setItem("user", JSON.stringify(user));
        navigation.replace("BottomTabNavigator");
      }
    });
    return unsibscribe;
  }, [loginPressed]);

  const handleSignUp = async () => {
    navigation.navigate("CreateNewAccount");
  };

  // const verifyIdToken = async (token: string) => {
  //   const url = `${EXPO_PUBLIC_API_URL}/users/verifyidtoken/`;
  //   const res = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body : JSON.stringify({
  //       idToken: token,
  //     }),
  //   });
  //   const decodedToken = await res.json();
  //   return decodedToken;
  // }

  // const checkUserToken = async () => {
  //   const token = await ReactNativeAsyncStorage.getItem("userToken");
  //   console.log("Token: ", token?.length ?? 0);
  //   if (token) {
  //     const user = await verifyIdToken(token);
  //     console.log("User: ", user);
  //     const checkUserExistsRes = await checkUserExists(user.email, "_");
  //     setUserExists(checkUserExistsRes.exists);
  //   }
  // }

  const handleLogin = async () => {
    try {
      if (!serverConnected) {
        alert("Server not connected");
        return;
      }
      const existsRes = await checkUserExists(email, "_");
      setUserExists(existsRes.exists);
      await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredentials.user;
      // const token = await user.getIdToken();
      // await ReactNativeAsyncStorage.setItem("userToken", token);
      setLoginPressed(true);
    } catch (error: any) {
      const errorCode = error.code;
      alert(getErrorMessage(errorCode, serverConnected));
    }
  };

  return (
    <>
      {serverConnected && (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView style={styles.root} behavior="padding">
            <View style={styles.title}>
              <Text style={styles.title} maxFontSizeMultiplier={1.2}>
                Login
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                maxFontSizeMultiplier={1.2}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                maxFontSizeMultiplier={1.2}
                secureTextEntry
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
      {!serverConnected && (
        <View style={styles.failed}>
          <Text style={styles.title} maxFontSizeMultiplier={1.2}>
            Unable to connect to server
          </Text>
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 6,
  },
  title: {
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    fontSize: Dimensions.get("window").width / 10,
    padding: 10,
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
    width: Dimensions.get("window").width - 80,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
  buttonContainer: {
    marginTop: 25,
  },
  button: {
    backgroundColor: MainHighlightColor,
    color: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
  },
  failed: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
