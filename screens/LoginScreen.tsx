import React, { useContext, useEffect, useState } from "react";
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
  Modal,
} from "react-native";
import { auth } from "../Models/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { LoginProps } from "../props";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";
import { getErrorMessage } from "../utils";
import { FirebaseError } from "firebase/app";
import AuthContext, { checkUserExists } from "../Controllers/AuthContext";

const LoginScreen = (props: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignUp = async () => {
    navigation.navigate("CreateNewAccount");
  };

  const authContext = useContext(AuthContext);

  // Ensure that authContext is defined
  if (!authContext) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  const { user, serverConnected, setUserExists } = authContext;

  useEffect(() => {
    if (user) {
      navigation.replace("BottomTabNavigator");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      if (!serverConnected) {
        alert("Server not connected");
        return;
      }
      const existsRes = await checkUserExists(email, "_");
      setUserExists(existsRes);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const errorCode = error.code;
      alert(getErrorMessage(errorCode, serverConnected));
    }
  };

  const handleResetPassword = async () => {
    if (!email || email === "") {
      setEmailError("Please enter an email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setEmailError(getErrorMessage(error.code, true));
      }
    }
  };

  const closeModal = async () => {
    setForgotPassword(false);
    setEmailError("");
    setResetEmailSent(false);
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
              <TouchableOpacity onPress={() => setForgotPassword(true)}>
                <Text maxFontSizeMultiplier={1.2} style={styles.forgotPassword}>
                  Forgot Password?
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
      <Modal
        animationType="none"
        transparent
        visible={forgotPassword}
        onRequestClose={() => setForgotPassword(false)}
      >
        {!resetEmailSent && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.modalInput}
                maxFontSizeMultiplier={1.2}
              />
              {emailError.length > 0 && (
                <Text style={styles.modalErrorMessage}>{emailError}</Text>
              )}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleResetPassword}
              >
                <Text style={styles.modalButtonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {resetEmailSent && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
              <Text style={styles.confirmationMessage}>Email Sent!</Text>
            </View>
          </View>
        )}
      </Modal>
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
  forgotPassword: {
    marginTop: 20,
    fontSize: Dimensions.get("window").width / 22,
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
  modalInput: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
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
  modalErrorMessage: {
    color: "red",
  },
  confirmationMessage: {
    fontSize: Dimensions.get("window").width / 18,
    padding: 15,
  },
});
