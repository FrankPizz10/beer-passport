import { API_URL } from "@env";
import { Beer, CollectionBeer, UserBeer } from "./SQLData";

export const fetchBeer = async (beer_id: number): Promise<Beer | undefined> => {
  try {
    const url = `${API_URL}/api/beers/${beer_id}`;
    const response = await fetch(url);
    const beer = await response.json();
    return beer;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserBeer = async (
  user_id: number,
  beer_id: number
): Promise<UserBeer | undefined> => {
  try {
    const url = `${API_URL}/api/userbeer/${user_id}/${beer_id}`;
    const response = await fetch(url);
    const userBeer = await response.json();
    return userBeer;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCollectionBeer = async (
  beer_id: number,
  collection_id?: number
): Promise<CollectionBeer | undefined> => {
  if (!collection_id) return;
  try {
    const url = `${API_URL}/api/collectionbeer/${collection_id}/${beer_id}`;
    const response = await fetch(url);
    const collectionBeer = await response.json();
    return collectionBeer;
  } catch (error) {
    console.log(error);
  }
};
