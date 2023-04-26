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
