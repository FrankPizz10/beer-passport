export type BasicBeer = {
  id: number;
  name: string;
};

export interface Beer extends BasicBeer {
  brewery_id: number;
  cat_id: number;
  style_id: number;
  abv: number;
  ibu: number;
  srm: number;
  upc: number;
  filepath: string;
  descript: string;
  add_user: number;
  last_mod: number;
  style?: Style;
  category?: Category;
  brewery?: Brewery;
}

export interface Category {
  id: number;
  cat_name: string;
  last_mod: number;
}

export interface Brewery {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  code: string;
  country: string;
  phone: string;
  website: string;
  filepath: string;
  descript: string;
  add_user: number;
  last_mod: number;
}

export interface Style {
  id: number;
  cat_id: number;
  style_name: string;
  last_mod: number;
}

export interface BeerId {
  id: number;
}

export interface User {
  id: number;
  user_name: string;
  private: boolean;
}

export interface UserBeer {
  id?: number;
  user_id: number;
  beer_id: number;
  liked: boolean;
  collection_id?: number;
}

export interface Collection {
  id: number;
  name: string;
  difficulty: number;
  description: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  collection_id: number;
  earned: boolean;
  progress: number;
  collections: Collection;
}

export interface CollectionBeer {
  id: number;
  collection_id: number;
  beer_id: number;
}

export interface Friend {
  id: number;
  user_1: number;
  user_2: number;
  users_friends_user_1Tousers: User;
  users_friends_user_2Tousers: User;
}
