import React, { useEffect, useState } from "react";
import { CreateAccountProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { auth } from "../Models/firebase";
import { API_URL } from "@env";

const CreateNewAccount = (props: CreateAccountProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");

  const navigation = useNavigation<(typeof props)["navigation"]>();

  useEffect(() => {
    const unsibscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsibscribe;
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userUID = userCredentials.user.uid;
      const url = `${API_URL}/api/users/`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: userUID,
          username: username,
          age: age,
          email: email,
        }),
      });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: ", errorCode);
      console.log("Error Message: ", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Create New Account</Text>
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
        <TextInput
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />
      </View>
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CreateNewAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: 300,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
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
