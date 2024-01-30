// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth/react-native";
// import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGE_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initalize Firebase Firestore
// export const db = getFirestore(app);
