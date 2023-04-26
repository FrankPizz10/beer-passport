import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Category: undefined;
  Beer: { id: number };
};

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type CategoryProps = NativeStackScreenProps<
  RootStackParamList,
  "Category"
>;
export type BeerProps = NativeStackScreenProps<RootStackParamList, "Beer">;
