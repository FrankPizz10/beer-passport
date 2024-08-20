import React, { ReactNode, createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../Models/firebase";
import { getUser } from "../screens/HomeScreen";
import { checkServerConnected } from "../Models/Requests";
import { isUser } from "../utils";
import { EXPO_PUBLIC_API_URL } from "@env";

export interface UserExists {
  exists: boolean;
  type: "email" | "username";
}

export const checkUserExists = async (
  email: string,
  username: string,
): Promise<UserExists> => {
  const userExistsURL = `${EXPO_PUBLIC_API_URL}/userexists/`;
  const userExists = await fetch(userExistsURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      user_name: username,
    }),
  });
  const existsRes = await userExists.json();
  return existsRes;
};

interface AuthContextType {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
  serverConnected: boolean;
  setServerConnected: (connected: boolean) => void;
  createUser: FirebaseUser | null;
  setCreateUser: (user: FirebaseUser | null) => void;
  deleteAccount: boolean;
  setDeleteAccount: (deleteAccount: boolean) => void;
  userExists: UserExists;
  setUserExists: (exists: UserExists) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [serverConnected, setServerConnected] = useState(false);
  const [createUser, setCreateUser] = useState<FirebaseUser | null>(null);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [userExists, setUserExists] = useState<UserExists>({} as UserExists);

  useEffect(() => {
    const authStateChangedHandler = async (authUser: FirebaseUser | null) => {
      try {
        setServerConnected(await checkServerConnected());
        const serverUser = await getUser();
        if (authUser) {
          // Handle account creation
          if (createUser && isUser(createUser) && serverUser) {
            setCreateUser(null);
            setUser(authUser);
          }
          // Handle account deletion
          else if (deleteAccount) {
            console.log("Delete Account");
            authUser.delete();
          }
          // Handle stored login or unstored login
          else if (serverConnected && serverUser && isUser(serverUser)) {
            setUser(authUser);
          }
        }
      } catch (error) {
        console.log("Error handling auth state change: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, authStateChangedHandler);

    return () => unsubscribe();
  }, [deleteAccount, createUser, serverConnected, userExists]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        serverConnected,
        setServerConnected,
        createUser,
        setCreateUser,
        deleteAccount,
        setDeleteAccount,
        userExists,
        setUserExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
