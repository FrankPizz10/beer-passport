import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
