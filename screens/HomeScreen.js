import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 50,
        fontWeight: "bold",
    },
});