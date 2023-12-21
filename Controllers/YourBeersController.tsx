import { useEffect, useState } from "react";
import { Beer, BeerId, UserBeer } from "../Models/SQLData";
import { API_URL } from "@env";
import { auth } from "../Models/firebase";

export const useYourBeers = (userId: number | undefined) => {
  const [triedBeers, setTriedBeers] = useState([] as Beer[]);
  const [likedBeers, setLikedBeers] = useState([] as Beer[]);

  const fetchBeers = async (userBeers: UserBeer[], tried: boolean) => {
    try {
      userBeers.forEach(async (userBeer) => {
        const url = `${API_URL}/api/beers/${userBeer.beer_id}`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const beer = await response.json();
        if (tried) {
          if (triedBeers.find((b) => b.id === beer.id)) return;
          setTriedBeers((prevTriedBeers) => [...prevTriedBeers, beer]);
        } else {
          if (likedBeers.find((b) => b.id === beer.id)) return;
          setLikedBeers((prevLikeBeers) => [...prevLikeBeers, beer]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      const userBeers = await response.json();
      fetchBeers(userBeers, tried);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const triedUrl = `${API_URL}/api/triedbeers/${userId}`;
    const likedUrl = `${API_URL}/api/likedbeers/${userId}`;
    fetchBeersHelper(triedUrl, true);
    fetchBeersHelper(likedUrl, false);
  }, [userId]);

  return { triedBeers, likedBeers };
};
