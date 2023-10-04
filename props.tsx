import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Category: undefined;
  Beer: { beer_id: number };
  CreateNewAccount: undefined;
  YourBeers: undefined;
  SearchBeers: undefined;
  YourBadges: undefined;
  AllCollections: undefined;
  Collection: { collection_id: number };
  Friends: undefined;
  AddFriends: undefined;
  FriendProfile: { friend_id: number };
  BottomTabNavigator: undefined;
  Notifications: undefined;
  SearchUsers: undefined;
};

export interface CommonNavButtonProps {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    "Home" | "Friends"
  >["navigation"];
}

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
  | CollectionProps
  | FriendsProps;

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

export type FriendsProps = NativeStackScreenProps<
  RootStackParamList,
  "Friends"
>;

export type AddFriendsProps = NativeStackScreenProps<
  RootStackParamList,
  "AddFriends"
>;

export type FriendProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "FriendProfile"
>;

export type NotificationsProps = NativeStackScreenProps<
  RootStackParamList,
  "Notifications"
>;

export type SearchUsersProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchUsers"
>;
