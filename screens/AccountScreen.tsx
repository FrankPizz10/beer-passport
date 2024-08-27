import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import DeleteAccountButton from "./DeleteAccountButton";
import { auth } from "../Models/firebase";
import { useNavigation } from "@react-navigation/core";
import { AccountProps } from "../props";
import { BackgroundColor, MainHighlightColor } from "../Styles/colors";
import { ProfanityMatcher } from "./CreateNewAccount";
import { getErrorMessage } from "../utils";
import { updateEmailInDB } from "../Models/Requests";
import AuthContext, { checkUserExists } from "../Controllers/AuthContext";

const AccountScreen = (props: AccountProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [modalErrosMessage, setModalErrorMessage] = useState("");
  const [updateAccountInfo, setUpdateAccountInfo] = useState<{
    updateUsername: boolean;
    updateEmail: boolean;
    updatePassword: boolean;
  }>({ updateUsername: false, updateEmail: false, updatePassword: false });
  const [accountDetails, setAccountDetails] = useState<{
    email: string;
    username: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }>({
    email: "",
    username: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [successDetails, setSuccessDetails] = useState<{
    emailUpdated: boolean;
    passwordUpdated: boolean;
    usernameUpdated: boolean;
  }>({ emailUpdated: false, passwordUpdated: false, usernameUpdated: false });

  const authContext = useContext(AuthContext);

  // Ensure that authContext is defined
  if (!authContext) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  const { setUser } = authContext;

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUsername = async () => {
    if (!auth.currentUser?.email) return;
    const existRes = await checkUserExists(
      auth.currentUser.email,
      accountDetails.username,
    );
    if (!existRes.exists) return;
    if (existRes.exists && existRes.type !== "email") {
      setModalErrorMessage("Username is already taken");
      return;
    }
    // Test Username for profanity
    if (ProfanityMatcher.hasMatch(accountDetails.username)) {
      setModalErrorMessage("Username contains profanity");
      return;
    }
    // Update username in app db
    closeModal();
    console.log("Updated Username!");
  };

  const handleUpdatePassword = () => {
    if (!auth.currentUser?.email) return;
    if (!validatePassword()) return;
    // UpdatePassword
    const oldCredential = EmailAuthProvider.credential(
      auth.currentUser.email,
      accountDetails.oldPassword,
    );
    reauthenticateWithCredential(auth.currentUser, oldCredential)
      .then(() => {
        if (!auth.currentUser?.email) return;
        updatePassword(auth.currentUser, accountDetails.password)
          .then(() => {
            if (!auth.currentUser?.email) return;
            const newCredential = EmailAuthProvider.credential(
              auth.currentUser.email,
              accountDetails.password,
            );
            reauthenticateWithCredential(auth.currentUser, newCredential)
              .then(() => {
                setSuccessDetails((prevSuccessState) => ({
                  ...prevSuccessState,
                  passwordUpdated: true,
                }));
                setUpdateAccountInfo((prevAccountState) => ({
                  ...prevAccountState,
                  updatePassword: false,
                }));
              })
              .catch((error) => {
                console.log(error);
                setModalErrorMessage(getErrorMessage(error.code, true));
              });
          })
          .catch((error) => {
            console.log(error);
            setModalErrorMessage(getErrorMessage(error.code, true));
          });
      })
      .catch((error) => {
        console.log(error);
        setModalErrorMessage(getErrorMessage(error.code, true));
      });
  };

  const validatePassword = () => {
    if (accountDetails.oldPassword.length < 1) {
      setModalErrorMessage("Please enter your current password");
      return false;
    }
    if (accountDetails.password.length < 1) {
      setModalErrorMessage("Please enter a password");
      return false;
    }
    if (accountDetails.confirmPassword.length < 1) {
      setModalErrorMessage("Please confirm your password");
      return false;
    }
    if (accountDetails.password !== accountDetails.confirmPassword) {
      setModalErrorMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleUpdateEmail = async () => {
    if (accountDetails.email.length < 1) {
      setModalErrorMessage("Please enter an email");
      return;
    }
    if (accountDetails.password.length < 1) {
      setModalErrorMessage("Please enter a password");
      return false;
    }
    if (!auth.currentUser?.email) return;
    const oldCredential = EmailAuthProvider.credential(
      auth.currentUser.email,
      accountDetails.password,
    );
    reauthenticateWithCredential(auth.currentUser, oldCredential)
      .then(() => {
        if (!auth.currentUser) return;
        updateEmail(auth.currentUser, accountDetails.email)
          .then(() => {
            if (!auth.currentUser) return;
            const newCredential = EmailAuthProvider.credential(
              accountDetails.email,
              accountDetails.password,
            );
            reauthenticateWithCredential(auth.currentUser, newCredential)
              .then(() => {
                updateEmailInDB(accountDetails.email)
                  .then(() => {
                    setSuccessDetails((prevSuccessState) => ({
                      ...prevSuccessState,
                      emailUpdated: true,
                    }));
                    setUpdateAccountInfo((prevAccountState) => ({
                      ...prevAccountState,
                      updateEmail: false,
                    }));
                  })
                  .catch(() => {
                    setModalErrorMessage("Internal Error");
                  });
              })
              .catch((error) => {
                setModalErrorMessage(getErrorMessage(error.code, true));
              });
          })
          .catch((error) => {
            setModalErrorMessage(getErrorMessage(error.code, true));
          });
      })
      .catch((error) => {
        console.log(error);
        setModalErrorMessage(getErrorMessage(error.code, true));
      });
  };

  const closeModal = async () => {
    setModalErrorMessage("");
    setUpdateAccountInfo({
      updateEmail: false,
      updateUsername: false,
      updatePassword: false,
    });
    setAccountDetails({
      username: "",
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
    setSuccessDetails({
      emailUpdated: false,
      passwordUpdated: false,
      usernameUpdated: false,
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} maxFontSizeMultiplier={1.2}>
          Account Screen
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Sign out
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setUpdateUsername(true)} style={styles.button}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Update Username
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            setUpdateAccountInfo((prevAccountState) => ({
              ...prevAccountState,
              updateEmail: true,
            }))
          }
          style={styles.button}
        >
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Update Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setUpdateAccountInfo((prevAccountState) => ({
              ...prevAccountState,
              updatePassword: true,
            }))
          }
          style={styles.button}
        >
          <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
            Update Password
          </Text>
        </TouchableOpacity>
        {!deleteAccount && (
          <TouchableOpacity
            onPress={() => setDeleteAccount(!deleteAccount)}
            style={styles.button}
          >
            <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
              Delete Account
            </Text>
          </TouchableOpacity>
        )}
        {deleteAccount && (
          <View>
            <Text style={styles.deleteAccountText} maxFontSizeMultiplier={1.2}>
              Are you sure you want to delete your account?
            </Text>
            <DeleteAccountButton navigation={navigation} />
          </View>
        )}
      </View>
      <Modal
        animationType="none"
        transparent
        visible={updateAccountInfo.updateEmail}
        onRequestClose={() =>
          setUpdateAccountInfo((prevAccountState) => ({
            ...prevAccountState,
            updateEmail: false,
          }))
        }
        id="EmailModal"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="New Email"
              placeholderTextColor="gray"
              value={accountDetails.email}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  email: text.replace(/\s/g, ""),
                }))
              }
              style={styles.modalInput}
              maxFontSizeMultiplier={1.2}
            />
            <TextInput
              placeholder="Current Password"
              placeholderTextColor="gray"
              value={accountDetails.password}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  password: text,
                }))
              }
              style={styles.modalInput}
              secureTextEntry
              maxFontSizeMultiplier={1.2}
            />
            {modalErrosMessage.length > 0 && (
              <Text style={styles.modalErrorMessage}>{modalErrosMessage}</Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateEmail}
            >
              <Text style={styles.modalButtonText}>Update Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent
        visible={updateAccountInfo.updateUsername}
        onRequestClose={() =>
          setUpdateAccountInfo((prevAccountState) => ({
            ...prevAccountState,
            updateUsername: false,
          }))
        }
        id="UsernameModal"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Username"
              placeholderTextColor="gray"
              value={accountDetails.username}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  username: text.replace(/\s/g, ""),
                }))
              }
              style={styles.modalInput}
              maxFontSizeMultiplier={1.2}
            />
            {modalErrosMessage.length > 0 && (
              <Text style={styles.modalErrorMessage}>{modalErrosMessage}</Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateUsername}
            >
              <Text style={styles.modalButtonText}>Update Username</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent
        visible={updateAccountInfo.updatePassword}
        onRequestClose={() =>
          setUpdateAccountInfo((prevAccountState) => ({
            ...prevAccountState,
            updatePassword: false,
          }))
        }
        id="PasswordModal"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Old Password"
              placeholderTextColor="gray"
              value={accountDetails.oldPassword}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  oldPassword: text,
                }))
              }
              style={styles.modalInput}
              secureTextEntry
              maxFontSizeMultiplier={1.2}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="gray"
              value={accountDetails.password}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  password: text,
                }))
              }
              style={styles.modalInput}
              secureTextEntry
              maxFontSizeMultiplier={1.2}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              value={accountDetails.confirmPassword}
              onChangeText={(text) =>
                setAccountDetails((prevAccountDetails) => ({
                  ...prevAccountDetails,
                  confirmPassword: text,
                }))
              }
              style={styles.modalInput}
              secureTextEntry
              maxFontSizeMultiplier={1.2}
            />
            {modalErrosMessage.length > 0 && (
              <Text style={styles.modalErrorMessage}>{modalErrosMessage}</Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent
        visible={successDetails.emailUpdated || successDetails.passwordUpdated}
        onRequestClose={() => closeModal}
        id="SuccessModal"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            {successDetails.emailUpdated && (
              <Text style={styles.confirmationMessage}>Email Updated!</Text>
            )}
            {successDetails.passwordUpdated && (
              <Text style={styles.confirmationMessage}>Password Updated!</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BackgroundColor,
    alignItems: "center",
  },
  titleContainer: {
    width: 400,
    alignItems: "center",
    marginTop: 15,
    padding: 15,
  },
  title: {
    fontSize: Dimensions.get("window").width / 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  buttonContainer: {
    alignItems: "center",
    height: 200,
    width: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: MainHighlightColor,
    color: "white",
    height: 50,
    padding: 10,
    margin: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  deleteAccountText: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
    textAlign: "center",
    width: Dimensions.get("window").width - 80,
    marginTop: 20,
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
