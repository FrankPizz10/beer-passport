import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Category: { user_id: number };
  Beer: { user_id: number; beer_id: number };
  CreateNewAccount: undefined;
  YourBeers: { user_id: number };
  SearchBeers: { user_id: number };
  YourBadges: { user_id: number };
  AllCollections: { user_id: number };
  Collection: { user_id: number; collection_id: number };
};

export type RouterProps =
  | LoginProps
  | HomeProps
  | CategoryProps
  | BeerProps
  | CreateAccountProps
  | YourBeersProps
  | SearchBeersProps
  | YourBadgesProps
  | AllCollectionsProps
  | CollectionProps;

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type CategoryProps = NativeStackScreenProps<
  RootStackParamList,
  "Category"
>;
export type BeerProps = NativeStackScreenProps<RootStackParamList, "Beer">;
export type CreateAccountProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateNewAccount"
>;
export type YourBeersProps = NativeStackScreenProps<
  RootStackParamList,
  "YourBeers"
>;
export type SearchBeersProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchBeers"
>;
export type YourBadgesProps = NativeStackScreenProps<
  RootStackParamList,
  "YourBadges"
>;

export type AllCollectionsProps = NativeStackScreenProps<
  RootStackParamList,
  "AllCollections"
>;

export type CollectionProps = NativeStackScreenProps<
  RootStackParamList,
  "Collection"
>;
