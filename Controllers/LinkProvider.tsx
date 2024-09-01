import React, { useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import * as Linking from 'expo-linking';
import { RootStackParamList } from "../props";
import AuthContext from "./AuthContext";


const getScreenNameFromPath = (path: string): keyof RootStackParamList | null => {
  switch (path) {
    case 'beer':
      return 'Beer';
    // Add cases for other paths
    default:
      return null;
  }
};

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

  useEffect(() => {
    const handleLink = async () => {
        
      try {
          const url = Linking.useURL();
          if (user && url) {
            const { path, queryParams } = Linking.parse(url);
            if (
              path &&
              queryParams &&
              typeof queryParams.id === 'string' &&
              !isNaN(parseInt(queryParams.id))
            ) {
              console.log('Path: ', path);
              const screenName = getScreenNameFromPath(path);
              console.log('Screename: ', screenName);
              const beerId = parseInt(queryParams.id);
              console.log('BeerId: ', beerId);
      
              if (screenName === 'Beer') {
                console.log("Navigating");
                navigation.navigate(screenName, {
                  beer_id: beerId,
                });
              } else {
                console.error(`Unhandled path: ${path}`);
              }
            }
        }
      } catch (error) {
        console.log("Error handling auth state change: ", error);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        link
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
