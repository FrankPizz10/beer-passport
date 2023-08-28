// This is develop branch
import { API_URL } from "@env";
import { Beer, Collection, CollectionBeer, Friend, UserBeer } from "./SQLData";
import { auth } from "../Models/firebase";

export const fetchAllBeers = async (): Promise<Beer[]> => {
  const url = `${API_URL}/api/beers`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const beers = await response.json();
  return beers;
};

export const fetchBeer = async (beer_id: number): Promise<Beer | undefined> => {
  try {
    const url = `${API_URL}/api/beers/${beer_id}`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 204) return undefined;
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
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 204) return undefined;
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
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 204) return undefined;
    const collectionBeer = await response.json();
    return collectionBeer;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllCollections = async (): Promise<Collection[]> => {
  const url = `${API_URL}/api/collections`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const collections = await response.json();
  return collections;
};

export const fetchCollection = async (
  collectionId: number
): Promise<Collection | undefined> => {
  const url = `${API_URL}/api/collections/${collectionId}`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.status === 204) return undefined;
  const collection = await response.json();
  return collection;
};

export const fetchCollectionBeersByCollectionId = async (
  collectionId: number
): Promise<CollectionBeer[]> => {
  const url = `${API_URL}/api/collections/${collectionId}/beers/`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const collectionBeers = await response.json();
  return collectionBeers;
};

export const fetchCollectionBeersByBeerId = async (
  beerId: number
): Promise<CollectionBeer[]> => {
  const url = `${API_URL}/api/beers/${beerId}/collections/`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const collectionBeers = await response.json();
  return collectionBeers;
};

export const fetchFriends = async (userId: number): Promise<Friend[]> => {
  const url = `${API_URL}/api/friends/${userId}`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const friends = await response.json();
  return friends;
};

export const deleteAccount = async (): Promise<void> => {
  const uid = auth.currentUser?.uid;
  const url = `${API_URL}/api/users/${uid}`;
  const token = await auth.currentUser?.getIdToken();
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  await auth.currentUser?.delete();
};
