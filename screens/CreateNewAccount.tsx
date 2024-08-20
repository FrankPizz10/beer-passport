import React, { useContext, useState } from "react";
import { CreateAccountProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { auth } from "../Models/firebase";
import { EXPO_PUBLIC_API_URL } from "@env";
import { getErrorMessage } from "../utils";
import { MainHighlightColor } from "../Styles/colors";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import AuthContext, { checkUserExists } from "../Controllers/AuthContext";

export const ProfanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const CreateNewAccount = (props: CreateAccountProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");

  const navigation = useNavigation<(typeof props)["navigation"]>();

  const authContext = useContext(AuthContext);

  // Ensure that authContext is defined
  if (!authContext) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  const { user, setCreateUser, serverConnected, setDeleteAccount } =
    authContext;

  const validateInputs = () => {
    if (email.length < 1) {
      alert("Please enter an email");
      return false;
    }
    const ageInt = parseInt(age);
    if (isNaN(ageInt)) {
      alert("Enter a valid Age");
      return false;
    }
    if (ageInt < 21) {
      alert("Must be at least 21 years old");
      return false;
    }
    if (username.length < 1) {
      alert("Please enter a username");
      return false;
    }
    if (username.length > 16) {
      alert("Username cannot be longer than 16 characters");
      return false;
    }
    if (ProfanityMatcher.hasMatch(username)) {
      alert("Username contains profanity");
      return false;
    }
    if (password.length < 1) {
      alert("Please enter a password");
      return false;
    }
    if (confirmPassword.length < 1) {
      alert("Please confirm your password");
      return false;
    }
    if (confirmPassword !== password) {
      alert("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    if (!serverConnected) {
      alert("Server not connected");
      return;
    }
    try {
      const existsRes = await checkUserExists(email, username);
      if (existsRes.exists) {
        if (existsRes.type === "email") {
          alert("Email already exists");
        } else {
          alert("Username already exists");
        }
        return;
      }
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userUID = userCredentials.user.uid;
      const url = `${EXPO_PUBLIC_API_URL}/api/users/`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          uid: userUID,
          user_name: username,
          age,
          email,
        }),
      });
      const curUser = await response.json();
      console.log("Create user: ", curUser);
      // await a successful response before verifying account
      if (response.status === 200) {
        //sendEmailVerification(userCredentials.user);
        setCreateUser(curUser);
        if (user) {
          navigation.replace("BottomTabNavigator");
        }
      } else {
        alert("Account creation failed");
        console.log("FORCED DELETE");
        setDeleteAccount(true);
      }
    } catch (error: any) {
      const errorCode = error.code;
      console.log(error);
      alert(getErrorMessage(errorCode, serverConnected));
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title} maxFontSizeMultiplier={1.2}>
          Create Account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
            style={styles.input}
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            placeholder="Age"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => setAge(text.replace(/\s/g, ""))}
            style={styles.input}
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="gray"
            value={username}
            onChangeText={(text) => setUsername(text.replace(/\s/g, ""))}
            style={styles.input}
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            style={styles.input}
            secureTextEntry
            maxFontSizeMultiplier={1.2}
          />
        </View>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Register
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: Dimensions.get("window").width - 80,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
    marginBottom: 20,
  },
  input: {
    height: Dimensions.get("window").height / 18,
    margin: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 10,
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
});
