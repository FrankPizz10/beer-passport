export interface Beer {
  id: number;
  brewery_id: number;
  name: string;
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
  uid: string;
  email: string;
  age: number;
  user_name: string;
}

export interface UserBeer {
  id: number;
  user_id: number;
  beer_id: number;
  tried: boolean;
  liked: boolean;
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
