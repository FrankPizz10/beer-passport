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

const LoginScreen = (props: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPressed, setLoginPressed] = useState(false);

  const navigation = useNavigation<(typeof props)["navigation"]>();

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
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoginPressed(true);
      const user = userCredentials.user;
      console.log("Logged in with:", user.email);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: ", errorCode);
      console.log("Error Message: ", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <View style={styles.title}>
        <Text style={styles.title}>Login Screen</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
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
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
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
    fontSize: 30,
    padding: 10,
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
    backgroundColor: "blue",
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
});
