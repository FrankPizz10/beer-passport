import { useCallback, useState } from "react";
import { Beer, UserBeer } from "../Models/SQLData";
import { EXPO_PUBLIC_API_URL } from "@env";
import { auth } from "../Models/firebase";
import { useFocusEffect } from "@react-navigation/core";

export const useYourBeers = (userId: number | undefined) => {
  const [triedBeers, setTriedBeers] = useState<Beer[]>();
  const [likedBeers, setLikedBeers] = useState<Beer[]>();

  const fetchBeersHelper = async (url: string, tried: boolean) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const responseData: UserBeer[] = await response.json();
      const filteredBeers: Beer[] = responseData.flatMap(({ beers }) => {
        // Use a conditional check to handle cases where beers is undefined
        return beers ? beers : [];
      });
      if (tried) {
        setTriedBeers(filteredBeers);
      }
      else {
        setLikedBeers(filteredBeers);
      }
    } catch (error) { 
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const triedUrl = `${EXPO_PUBLIC_API_URL}/api/triedbeers/${userId}`;
      const likedUrl = `${EXPO_PUBLIC_API_URL}/api/likedbeers/${userId}`;
      fetchBeersHelper(triedUrl, true);
      fetchBeersHelper(likedUrl, false);
    }, []),
  );

  return { triedBeers, likedBeers };
};
