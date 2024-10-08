// This is develop branch
import { EXPO_PUBLIC_API_URL } from "@env";
import {
  Beer,
  Collection,
  CollectionBeer,
  Friend,
  User,
  UserBeer,
  BasicBeer,
  Notification,
  BasicBrewery,
} from "./SQLData";
import { auth } from "../Models/firebase";

export const fetchAllBeers = async (): Promise<BasicBeer[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/beers/basic`;
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

export const fetchAllBreweries = async (): Promise<
  BasicBrewery[] | undefined
> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/breweries/basic`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const breweries = await response.json();
    return breweries;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMostPopularBreweries = async (): Promise<
  BasicBrewery[] | undefined
> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/breweries/popular`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const breweries = await response.json();
    return breweries;
  } catch (error) {
    console.log(error);
  }
};

export const fetchNewestBeer = async (): Promise<number | undefined> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/beers/newest`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    return data.lastMod;
  } catch (error) {
    console.log(error);
  }
};

export const fetchBeer = async (beer_id: number): Promise<Beer | undefined> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/beers/${beer_id}/?includeBrewery=true&includeStyle=true`;
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
  beer_id: number,
): Promise<UserBeer | undefined> => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/userbeer/${beer_id}`;
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
  collection_id?: number,
): Promise<CollectionBeer | undefined> => {
  if (!collection_id) return;
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/collectionbeer/${collection_id}/${beer_id}`;
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
  const url = `${EXPO_PUBLIC_API_URL}/api/collections`;
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
  collectionId: number,
): Promise<Collection | undefined> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/collections/${collectionId}`;
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
  collectionId: number,
): Promise<CollectionBeer[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/collections/${collectionId}/beers/`;
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
  beerId: number,
): Promise<CollectionBeer[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/beers/${beerId}/collections/`;
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

export const fetchFriends = async (): Promise<Friend[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/friends/`;
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
  const url = `${EXPO_PUBLIC_API_URL}/api/users/`;
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

export const fetchAllUsers = async (): Promise<User[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/users`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const users = await response.json();
  return users;
};

export const addFriend = async (user2: number): Promise<void> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/friends/${user2}`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  await response.json();
};

export const removeFriend = async (user2: number): Promise<void> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/friends/${user2}`;
  const token = await auth.currentUser?.getIdToken();
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
};

export const fetchUserById = async (userId: number): Promise<User> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/users/${userId}`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const user = await response.json();
  return user;
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/notifications`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const notifications = await response.json();
  return notifications;
};

export const fetchUserByUserName = async (userName: string): Promise<User> => {
  const url = `${EXPO_PUBLIC_API_URL}/api/userbyname/${userName}`;
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const user = await response.json();
  return user;
};

export const checkServerConnected = async () => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/`;
    const response = await fetch(url);
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateEmailInDB = async (email: string) => {
  try {
    const url = `${EXPO_PUBLIC_API_URL}/api/users/email`;
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ email }),
    });
    const user = await response.json();
    if (user.email !== email) {
      throw new Error("Failed to update Email in db");
    }
  } catch (error) {
    console.log(error);
  }
};
