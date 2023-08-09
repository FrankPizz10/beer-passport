import { useEffect, useState } from "react";
import { Beer, BeerId, UserBeer } from "../Models/SQLData";
import { API_URL } from "@env";

export const useYourBeers = (userId: number) => {
  const [triedBeers, setTriedBeers] = useState([] as Beer[]);
  const [likedBeers, setLikedBeers] = useState([] as Beer[]);

  const fetchBeers = async (userBeers: UserBeer[], tried: boolean) => {
    try {
      userBeers.forEach(async (userBeer) => {
        const url = `${API_URL}/api/beers/${userBeer.beer_id}`;
        const response = await fetch(url);
        const beer = await response.json();
        if (tried) {
          setTriedBeers((beers) => [...beers, beer]);
        } else {
          setLikedBeers((beers) => [...beers, beer]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBeersHelper = async (url: string, tried: boolean) => {
    try {
      const response = await fetch(url);
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
