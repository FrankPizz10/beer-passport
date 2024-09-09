import React, { ReactNode, createContext, useContext, useEffect } from "react";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../props";
import { getScreenNameFromPath } from "../utils";
import AuthContext from "./AuthContext";
import { auth } from "../Models/firebase";

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

  const handleLink = async (url: string | null) => {
    console.log("Url: ", url);
    console.log("User: ", auth.currentUser?.displayName);
    if (url && auth.currentUser) {
      const { path, queryParams } = Linking.parse(url);
      console.log("path: ", path);
      console.log("queryParams: ", queryParams);
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
    handleLink(deepLink);
    const linkingSubscription = Linking.addEventListener("url", ({ url }) =>
      handleLink(url),
    );
    return () => {
      linkingSubscription.remove();
    };
  }, []);

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
