import { useEffect, useState } from "react";
import { Beer, BeerId } from "../Models/SQLData";
import { API_URL } from "@env";

export const useYourBeers = (userId: string) => {
  const [beers, setBeers] = useState([] as Beer[]);
  useEffect(() => {
    const fetchTriedBeers = async () => {
      try {
        const url = `${API_URL}/api/users/tried/${userId}`;
        async function fetchBeersHelper(): Promise<BeerId[]> {
          const response = await fetch(url);
          const triedBeers = await response.json();
          console.log("triedbeersids: " + triedBeers);
          return triedBeers;
        }
        const triedBeersIds = await fetchBeersHelper();
        fetchBeers(triedBeersIds);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBeers = async (triedBeersIds: BeerId[]) => {
      try {
        triedBeersIds.forEach(async (beerId) => {
          const url = `${API_URL}/api/beers/${beerId.id}`;
          async function fetchBeerHelper(): Promise<Beer> {
            const response = await fetch(url);
            const beer = await response.json();
            return beer;
          }
          const beer = await fetchBeerHelper();
          setBeers((beers) => [...beers, beer]);
          console.log("triedbeers: " + beers);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTriedBeers();
  }, [userId]);
  return beers;
};
