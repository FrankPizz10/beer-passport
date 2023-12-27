import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { auth } from "../Models/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { LoginProps } from "../props";
import { API_URL } from "@env";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";

export const getErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "User account disabled.";
    case "auth/user-not-found":
      return "User account not found.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/missing-password":
      return "Missing password.";
    case "auth/weak-password":
      return "Password is too weak. Must be at least 6 characters long.";
    case "auth/email-already-exists":
      return "Email address already in use.";
    default:
      return "Unknown error occurred.";
  }
};

const LoginScreen = (props: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPressed, setLoginPressed] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  const navigation = useNavigation<(typeof props)["navigation"]>();

  useEffect(() => {
    const checkServerConnected = async () => {
      const url = `${API_URL}/`;
      const response = await fetch(url);
      if (response.status === 200) {
        setServerConnected(true);
      }
    };
    checkServerConnected();
  }, []);

  useEffect(() => {
    const unsibscribe = onAuthStateChanged(auth, (user) => {
      if (user && loginPressed) {
        navigation.replace("BottomTabNavigator");
      }
    });
    return unsibscribe;
  }, [loginPressed]);

  const handleSignUp = async () => {
    navigation.navigate("CreateNewAccount");
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginPressed(true);
    } catch (error: any) {
      const errorCode = error.code;
      alert(getErrorMessage(errorCode));
    }
  };

  return (
    <>
      {serverConnected && (
        <KeyboardAvoidingView style={styles.root} behavior="padding">
          <View style={styles.title}>
            <Text style={styles.title}>Login</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      {!serverConnected && (
        <View style={styles.failed}>
          <Text style={styles.title}>Unable to connect to server</Text>
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
    fontSize: 40,
    padding: 10,
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
    width: 300,
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
    fontSize: 20,
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
