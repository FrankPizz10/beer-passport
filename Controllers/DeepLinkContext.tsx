import React, { ReactNode, createContext, useContext, useEffect } from "react";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../props";
import { getScreenNameFromPath } from "../utils";
import AuthContext from "./AuthContext";

interface DeepLinkContextType {
  deepLink: string | null;
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(
  undefined,
);

interface DeepLinkProviderProps {
  children: ReactNode;
}

export const DeepLinkProvider = ({ children }: DeepLinkProviderProps) => {
  const deepLink = Linking.useURL();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const authContext = useContext(AuthContext);

  // Ensure that authContext is defined
  if (!authContext) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  const { user } = authContext;

  const handleLink = async (url: string | null) => {
    if (url && user) {
      const { path, queryParams } = Linking.parse(url);
      if (
        path &&
        queryParams &&
        typeof queryParams.id === "string" &&
        !isNaN(parseInt(queryParams.id))
      ) {
        const screenName = getScreenNameFromPath(path);
        const beerId = parseInt(queryParams.id);

        if (screenName === "Beer") {
          console.log("Navigating to BeerScreen");
          navigation.navigate(screenName, {
            beer_id: beerId,
          });
        } else {
          console.error(`Unhandled path: ${path}`);
        }
      }
    }
  };

  useEffect(() => {
    handleLink(deepLink); // Handle links when the app is opened
    // Adds a listener to allow app to check for reopens with link
    const linkingSubscription = Linking.addEventListener("url", ({ url }) =>
      handleLink(url),
    );
    return () => {
      linkingSubscription.remove();
    };
  }, [deepLink, user]);

  return (
    <DeepLinkContext.Provider
      value={{
        deepLink,
      }}
    >
      {children}
    </DeepLinkContext.Provider>
  );
};
